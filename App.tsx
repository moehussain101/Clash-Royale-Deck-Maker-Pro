import React, { useState, useEffect, useMemo } from "react";
import {
	Routes,
	Route,
	Link,
	useLocation,
	useNavigate,
} from "react-router-dom";
import {
	Sword,
	Search,
	Users,
	User,
	Trash2,
	Share2,
	Star,
	ShieldAlert,
	TrendingUp,
	Moon,
	Sun,
	Crown,
	Zap,
	Info,
	ArrowRightLeft,
	ThumbsUp,
	ThumbsDown,
	Trophy,
	Activity,
	Skull,
	Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, cards } from "./data/cards";
import { META_DECKS, getCardsForDeck } from "./data/metaDecks";
import {
	analyzeDeck,
	getSimilarDecks,
	generateDeckFromPrompt,
	DeckAnalysis,
} from "./services/geminiService";
import { auth, db } from "./firebase";
import {
	onAuthStateChanged,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	User as FirebaseUser,
} from "firebase/auth";
import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	doc,
	setDoc,
	getDoc,
	deleteDoc,
	serverTimestamp,
	orderBy,
} from "firebase/firestore";
import { cn } from "./lib/utils";
import ReactMarkdown from "react-markdown";

export const showToast = (text: string, type: "success" | "error" | "info" = "info") => {
	window.dispatchEvent(new CustomEvent("app-toast", { detail: { text, type } }));
};

const GlobalToast = () => {
	const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

	useEffect(() => {
		const handler = (e: any) => {
			setToast(e.detail);
			setTimeout(() => setToast(null), 3000);
		};
		window.addEventListener("app-toast", handler);
		return () => window.removeEventListener("app-toast", handler);
	}, []);

	if (!toast) return null;

	const colors = {
		success: "bg-green-500",
		error: "bg-red-500",
		info: "bg-indigo-500",
	};

	return (
		<div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4">
			<div className={`${colors[toast.type]} text-white px-6 py-3 rounded-full shadow-xl font-medium flex items-center gap-2`}>
				{toast.text}
			</div>
		</div>
	);
};

const SaveDeckModal = ({ isOpen, onClose, onSave, isSaving }: { isOpen: boolean, onClose: () => void, onSave: (name: string, isPublic: boolean) => void, isSaving: boolean }) => {
	const [name, setName] = useState("");
	const [isPublic, setIsPublic] = useState(true);
	
	useEffect(() => {
		if (isOpen) {
			setName("");
			setIsPublic(true);
		}
	}, [isOpen]);

	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
			<div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
				<h3 className="text-2xl font-bold font-display mb-4">Name your deck</h3>
				<input 
					type="text" 
					value={name} 
					onChange={e => setName(e.target.value)} 
					placeholder="E.g. Hog Cycle" 
					className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" 
					autoFocus 
				/>
				<label className="flex items-center gap-3 mb-6 cursor-pointer group">
					<div className="relative flex items-center justify-center">
						<input 
							type="checkbox" 
							className="peer sr-only"
							checked={isPublic}
							onChange={e => setIsPublic(e.target.checked)}
						/>
						<div className="w-5 h-5 rounded border border-slate-700 bg-slate-950 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors flex items-center justify-center">
							{isPublic && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
						</div>
					</div>
					<span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
						Share with Community
					</span>
				</label>
				<div className="flex gap-3 justify-end">
					<Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
					<Button onClick={() => onSave(name, isPublic)} disabled={isSaving || !name.trim()}>{isSaving ? "Saving..." : "Save Deck"}</Button>
				</div>
			</div>
		</div>
	);
};

// --- Shared Components ---

const Button = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
		size?: "default" | "sm" | "lg" | "icon";
	}
>(({ className, variant = "primary", size = "default", ...props }, ref) => {
	const variants = {
		primary:
			"bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20",
		secondary: "bg-amber-500 hover:bg-amber-600 text-slate-900",
		outline: "border border-slate-700 hover:bg-slate-800 text-slate-100",
		danger: "bg-rose-600 hover:bg-rose-700 text-white",
		ghost: "hover:bg-slate-800 text-slate-400 hover:text-white",
	};
	const sizes = {
		default: "h-10 px-4 py-2",
		sm: "h-8 px-3 text-xs",
		lg: "h-12 px-8",
		icon: "h-10 w-10",
	};
	return (
		<button
			ref={ref}
			className={cn(
				"inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider",
				variants[variant],
				sizes[size],
				className,
			)}
			{...props}
		/>
	);
});

// --- Pages ---

const DeckBuilder = ({
	deck,
	setDeck,
	slotTransformPreferences,
	setSlotTransformPreferences,
	analysis,
	setAnalysis,
	isAnalyzing,
	runAnalysis,
}: {
	deck: (Card | null)[];
	setDeck: React.Dispatch<React.SetStateAction<(Card | null)[]>>;
	slotTransformPreferences: ("evo" | "hero")[];
	setSlotTransformPreferences: React.Dispatch<
		React.SetStateAction<("evo" | "hero")[]>
	>;
	analysis: DeckAnalysis | null;
	setAnalysis: React.Dispatch<React.SetStateAction<DeckAnalysis | null>>;
	isAnalyzing: boolean;
	runAnalysis: () => void;
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filter, setFilter] = useState<"all" | "troop" | "spell" | "building">(
		"all",
	);
	const [rarityFilter, setRarityFilter] = useState<"all" | Card["rarity"]>(
		"all",
	);
	const [sortBy, setSortBy] = useState<"rarity" | "elixir" | "name">("name");
	const slotRefs = React.useRef<(HTMLDivElement | null)[]>([]);

	const [activeDragId, setActiveDragId] = useState<string | null>(null);
	const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);
	const [draggedFromIndex, setDraggedFromIndex] = useState<number | null>(null);

	const [generatorPrompt, setGeneratorPrompt] = useState("");
	const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);

	const handleAiGenerate = async () => {
		if (!generatorPrompt.trim()) return;
		setIsGeneratingDeck(true);
		
		try {
			const availableCardNames = cards.map(c => c.name);
			const generatedCardNames = await generateDeckFromPrompt(generatorPrompt, availableCardNames);
			
			if (generatedCardNames && generatedCardNames.length > 0) {
				const newDeck = [...deck];
				let currentSlot = 0;
				for (const name of generatedCardNames) {
					if (currentSlot >= 8) break;
					const card = cards.find(c => c.name.toLowerCase() === name.toLowerCase());
					if (card) {
						newDeck[currentSlot] = card;
						currentSlot++;
					}
				}
				setDeck(newDeck);
				showToast("AI Deck Generated successfully!", "success");
			} else {
				showToast("Failed to generate deck. Please try again.", "error");
			}
		} catch (e) {
			showToast("Error generating deck.", "error");
		} finally {
			setIsGeneratingDeck(false);
		}
	};

	const avgElixir = useMemo(() => {
		const validCards = deck.filter((c): c is Card => c !== null);
		if (validCards.length === 0) return "0.0";
		return (
			validCards.reduce((sum, c) => sum + c.elixir, 0) / validCards.length
		).toFixed(1);
	}, [deck]);

	const filteredCards = useMemo(() => {
		let result = cards.filter((c) => {
			const matchesSearch = c.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesType = filter === "all" || c.type === filter;
			const matchesRarity =
				rarityFilter === "all" ||
				c.rarity === rarityFilter ||
				(rarityFilter === "hero" && c.hasHeroForm);
			return matchesSearch && matchesType && matchesRarity;
		});

		const rarityOrder: Record<Card["rarity"], number> = {
			common: 0,
			rare: 1,
			epic: 2,
			legendary: 3,
			champion: 4,
			hero: 5,
		};

		return result.sort((a, b) => {
			if (sortBy === "rarity")
				return rarityOrder[b.rarity] - rarityOrder[a.rarity];
			if (sortBy === "elixir") return a.elixir - b.elixir;
			return a.name.localeCompare(b.name);
		});
	}, [searchTerm, filter, rarityFilter, sortBy]);

	const toggleCard = (card: Card) => {
		const existingIndex = deck.findIndex((c) => c?.id === card.id);

		if (existingIndex !== -1) {
			const newDeck = [...deck];
			newDeck[existingIndex] = null;
			setDeck(newDeck);
			return;
		}

		const currentCount = deck.filter((c) => c !== null).length;
		if (currentCount >= 8) return;

		const newDeck = [...deck];

		let placed = false;
		// Find first empty slot (0-7)
		for (let i = 0; i < 8; i++) {
			if (!newDeck[i]) {
				newDeck[i] = card;
				placed = true;
				break;
			}
		}

		if (!placed) {
			showToast("Deck is full!", "error");
			return;
		}

		if (card.rarity === "champion" && newDeck[2]?.id === card.id) {
			const p = [...slotTransformPreferences];
			p[2] = "hero";
			setSlotTransformPreferences(p);
		}

		setDeck(newDeck);
	};

	const addCardToSlot = (
		card: Card,
		slotIndex: number,
		fromIndex: number | null = null,
	) => {
		const newDeck = [...deck];

		let needsWildHeroForce = false;

		if (fromIndex !== null) {
			// Swapping slots
			const targetCard = newDeck[slotIndex];
			
			newDeck[slotIndex] = card;
			newDeck[fromIndex] = targetCard;

			if (targetCard && targetCard.rarity === "champion" && fromIndex === 2) {
				needsWildHeroForce = true;
			}
		} else {
			// From library
			const existingIndex = newDeck.findIndex((c) => c?.id === card.id);
			if (existingIndex !== -1) {
				// Swap if already in deck
				const targetCard = newDeck[slotIndex];
				
				newDeck[slotIndex] = card;
				newDeck[existingIndex] = targetCard;

				if (targetCard && targetCard.rarity === "champion" && existingIndex === 2) {
					needsWildHeroForce = true;
				}
			} else {
				newDeck[slotIndex] = card;
			}
		}

		if (card.rarity === "champion" && slotIndex === 2) {
			needsWildHeroForce = true;
		}

		if (needsWildHeroForce) {
			const p = [...slotTransformPreferences];
			p[2] = "hero";
			setSlotTransformPreferences(p);
		}

		setDeck(newDeck);
	};

	const findSlotUnderCursor = (x: number, y: number) => {
		for (let i = 0; i < 8; i++) {
			const slot = slotRefs.current[i];
			if (slot) {
				const rect = slot.getBoundingClientRect();
				if (
					x >= rect.left &&
					x <= rect.right &&
					y >= rect.top &&
					y <= rect.bottom
				) {
					return i;
				}
			}
		}
		return null;
	};

	const handleDrag = (event: any, info: any) => {
		setHoveredSlotIndex(findSlotUnderCursor(info.point.x, info.point.y));
	};

	const handleDragEnd = (
		event: any,
		info: any,
		card: Card,
		fromIndex: number | null = null,
	) => {
		const slotIndex = findSlotUnderCursor(info.point.x, info.point.y);
		setActiveDragId(null);
		setHoveredSlotIndex(null);
		setDraggedFromIndex(null);

		if (slotIndex !== null) {
			addCardToSlot(card, slotIndex, fromIndex);
		}
	};

	const clearDeck = () => {
		setDeck(Array(8).fill(null));
		setAnalysis(null);
	};

	const SLOT_CONFIG = [
		{
			label: "Evolution",
			type: "evolution",
			icon: <Zap className="w-4 h-4" />,
		},
		{ label: "Hero", type: "hero", icon: <Crown className="w-4 h-4" /> },
		{ label: "Wild Slot", type: "wild", icon: <Star className="w-4 h-4" /> },
		{ label: "Card slot", type: "normal" },
		{ label: "Card slot", type: "normal" },
		{ label: "Card slot", type: "normal" },
		{ label: "Card slot", type: "normal" },
		{ label: "Card slot", type: "normal" },
	];

	const deckHealth = useMemo(() => {
		const validCards = deck.filter((c): c is Card => c !== null);
		const warnings: { type: "problem" | "warning"; message: string }[] = [];

		const winConditions = [
			"hog-rider",
			"giant",
			"golem",
			"pekka",
			"balloon",
			"hero-balloon",
			"royal-giant",
			"goblin-giant",
			"electro-giant",
			"ram-rider",
			"battle-ram",
			"wall-breakers",
			"mortar",
			"x-bow",
			"graveyard",
			"goblin-barrel",
			"skeleton-barrel",
			"miner",
			"royal-hogs",
		];
		const smallSpells = [
			"zap",
			"arrows",
			"log",
			"barbarian-barrel",
			"snowball",
			"void",
		];
		const bigSpells = ["fireball", "poison", "rocket", "lightning", "void"];
		const airDefense = [
			"musketeer",
			"wizard",
			"archers",
			"baby-dragon",
			"hunter",
			"executioner",
			"electro-wizard",
			"ice-wizard",
			"magic-archer",
			"dart-goblin",
			"mega-minion",
			"minions",
			"minion-horde",
			"bats",
			"inferno-dragon",
			"inferno-tower",
			"tesla",
			"flying-machine",
			"phoenix",
			"little-prince",
			"archer-queen",
		];

		if (validCards.length > 0) {
			if (!validCards.some((c) => winConditions.includes(c.id))) {
				warnings.push({
					type: "problem",
					message: "No clear Win Condition! Taking towers might be tough.",
				});
			}
			if (
				validCards.length >= 6 &&
				!validCards.some(
					(c) =>
						airDefense.includes(c.id) ||
						airDefense.some((id) => c.id.includes(id)),
				)
			) {
				warnings.push({
					type: "problem",
					message:
						"Critically low air defense! Lava Hound and Balloon will wreck you.",
				});
			}
			if (validCards.length === 8) {
				if (!validCards.some((c) => smallSpells.includes(c.id))) {
					warnings.push({
						type: "warning",
						message: "No light spells detected. Be careful with swarms.",
					});
				}
				if (parseFloat(avgElixir) > 4.2) {
					warnings.push({
						type: "warning",
						message: "High elixir cost. Cycle will be slow.",
					});
				}
			}

			const heroCount = validCards.filter(
				(c) => c.isChampion || c.rarity === "champion",
			).length;
			if (heroCount > 1) {
				warnings.push({
					type: "problem",
					message: "Decks can only contain 1 Champion!",
				});
			}

			const evoCount = validCards.filter((c, i) => {
				const isEvoSlot = i === 0;
				const isWildSlot = i === 2;
				const currentPreference = slotTransformPreferences[i];
				return (
					(isEvoSlot || (isWildSlot && currentPreference === "evo")) &&
					c.hasEvolution
				);
			}).length;
			if (evoCount > 2) {
				warnings.push({
					type: "warning",
					message: "Only up to 2 Evolutions can be active in a match.",
				});
			}
		}
		return warnings;
	}, [deck, avgElixir, slotTransformPreferences]);

	return (
		<div className="flex flex-col gap-8">
			{/* Current Deck Top Section */}
			<div className="w-full space-y-6">
				<div className="bg-slate-900 border-4 border-slate-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
					{/* Decorative background like CR */}
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-2xl font-display font-black flex items-center gap-2 italic uppercase tracking-tighter text-white">
								<Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
								Battle Deck
							</h2>
							<p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
								Deck Builder Pro
							</p>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={clearDeck}
							className="rounded-full hover:bg-rose-500/20 text-rose-400"
						>
							<Trash2 className="w-5 h-5" />
						</Button>
					</div>

					<div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4 mb-8">
						{SLOT_CONFIG.map((slot, i) => {
							const card = deck[i];
							const isBeingDragged =
								activeDragId === card?.id && draggedFromIndex === i;
							const previewSlotIndex =
								isBeingDragged && hoveredSlotIndex !== null
									? hoveredSlotIndex
									: i;

							const isEvoSlot = previewSlotIndex === 0;
							const isHeroSlot = previewSlotIndex === 1;
							const isWildSlot = previewSlotIndex === 2;

							// Transformation conditions:
							// Slot 0: Evo only
							// Slot 1: Hero only
							// Slot 2: Both Evo and Hero (Wild Slot)
							const canTransformEvo =
								(isEvoSlot || isWildSlot) && card?.hasEvolution;
							const canTransformHero =
								(isHeroSlot || isWildSlot) &&
								(card?.rarity === "champion" ||
									card?.rarity === "hero" ||
									card?.hasHeroForm);
							const hasBoth = canTransformEvo && canTransformHero;
							const currentPreference =
								slotTransformPreferences[previewSlotIndex];

							const wantsEvo =
								isEvoSlot || (isWildSlot && currentPreference === "evo");
							const wantsHero =
								isHeroSlot || (isWildSlot && currentPreference === "hero");

							let cardImg = card?.image || null;
							if (card) {
								if (wantsEvo && card.hasEvolution) {
									// Try to find a specific Evo card first
									const evoCard = cards.find(
										(c) =>
											(c.name.includes("Evo") && c.name.includes(card.name)) ||
											c.id === `evo-${card.id}`,
									);
									if (evoCard) {
										cardImg = evoCard.image;
									} else {
										cardImg = card.image.replace(".png", "-ev1.png");
									}
								} else if (
									wantsHero &&
									(card.rarity === "champion" ||
										card.rarity === "hero" ||
										card.hasHeroForm)
								) {
									if (
										card.isChampion ||
										card.rarity === "champion" ||
										card.isHero ||
										card.rarity === "hero"
									) {
										cardImg = card.image;
									} else {
										// Try to find a specific Hero card first
										const heroCard = cards.find(
											(c) =>
												(c.name.includes("Hero") &&
													c.name.includes(card.name)) ||
												c.id === `hero-${card.id}`,
										);
										if (heroCard) {
											cardImg = heroCard.image;
										} else {
											cardImg = `https://cdn.royaleapi.com/static/img/cards-150/${card.id}-hero.png`;
										}
									}
								}
							}

							const isEvolved =
								isEvoSlot ||
								(isWildSlot &&
									currentPreference === "evo" &&
									card?.hasEvolution);
							const isHeroActive =
								isHeroSlot ||
								(isWildSlot &&
									currentPreference === "hero" &&
									(card?.rarity === "champion" ||
										card?.rarity === "hero" ||
										card?.hasHeroForm));

							return (
								<div key={i} className="relative aspect-[3/4]">
									{isWildSlot && (
										<div className="absolute z-40 -top-3 left-1/2 -translate-x-1/2 flex items-center bg-slate-950 border border-slate-700 rounded shadow-sm overflow-hidden p-0.5">
											<button
												onClick={(e) => {
													e.stopPropagation();
													if (card?.rarity === "champion") return;
													const p = [...slotTransformPreferences];
													p[i] = "evo";
													setSlotTransformPreferences(p);
												}}
												className={cn(
													"p-1 transition-colors relative z-10",
													currentPreference === "evo"
														? "bg-purple-600 text-white rounded-[2px]"
														: "text-slate-500 hover:text-slate-300",
													card?.rarity === "champion" && "opacity-50 cursor-not-allowed"
												)}
												title="Set Wild Slot to Evolution"
												disabled={card?.rarity === "champion"}
											>
												<Zap className="w-3 h-3" />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation();
													const p = [...slotTransformPreferences];
													p[i] = "hero";
													setSlotTransformPreferences(p);
												}}
												className={cn(
													"p-1 transition-colors relative z-10",
													currentPreference === "hero"
														? "bg-yellow-500 text-white rounded-[2px]"
														: "text-slate-500 hover:text-slate-300",
												)}
												title="Set Wild Slot to Hero"
											>
												<Crown className="w-3 h-3" />
											</button>
										</div>
									)}
									<div
										ref={(el) => {
											slotRefs.current[i] = el;
										}}
										className={cn(
											"w-full h-full rounded-xl border-4 flex flex-col items-center justify-center transition-all overflow-hidden relative group shadow-inner",
											hoveredSlotIndex === i &&
												"border-indigo-400 bg-indigo-500/10 scale-105 z-30",
											card
												? cn(
														"border-slate-700",
														`card-${card.rarity}`,
														isEvolved && !isWildSlot && "evolved-glow",
														isHeroActive && !isWildSlot && "hero-glow",
														isEvolved && isWildSlot && "evolved-wild-glow",
														isHeroActive && isWildSlot && "hero-wild-glow",
													)
												: isEvoSlot
													? "border-pink-500/40 bg-pink-950/20"
													: isHeroSlot
														? "border-amber-500/40 bg-amber-950/20"
														: isWildSlot
															? currentPreference === "evo"
																? "border-purple-500/40 bg-purple-950/20"
																: "border-yellow-500/40 bg-yellow-950/20"
															: "border-slate-800 bg-slate-950/50",
											!card && "border-dashed",
										)}
									>
										{card ? (
											<motion.div
												layoutId={`card-${card.id}`}
												layout
												drag
												dragSnapToOrigin
												whileDrag={{ scale: 1.1, zIndex: 100, rotate: 2 }}
												onDragStart={() => {
													setActiveDragId(card.id);
													setDraggedFromIndex(i);
												}}
												onDrag={handleDrag}
												onDragEnd={(e, info) => handleDragEnd(e, info, card, i)}
												className="w-full h-full p-1 cursor-grab active:cursor-grabbing touch-none flex flex-col items-center justify-center relative"
												onClick={(e) => {
													e.stopPropagation();
													toggleCard(card);
												}}
											>
												<img
													src={cardImg || card.image}
													onError={(e) => {
														const target = e.target as HTMLImageElement;
														if (!target.dataset.fallbackApplied) {
															target.dataset.fallbackApplied = "true";
															target.src = card.image;
															if (wantsHero || currentPreference === "hero") {
																target.classList.add("hero-tint");
															}
														}
													}}
													onLoad={(e) => {
														const target = e.target as HTMLImageElement;
														if (!target.dataset.fallbackApplied) {
															target.classList.remove("hero-tint");
														}
														target.dataset.fallbackApplied = "";
													}}
													alt={card.name}
													className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
												/>

												{/* Diamond overlays positioned exactly like CR */}
												{isEvolved && (
													<div className="diamond-badge bg-pink-600 border-pink-300 shadow-pink-500/50">
														<Zap className="-rotate-45 w-3.5 h-3.5 text-white fill-white" />
													</div>
												)}
												{isHeroActive && !isEvolved && (
													<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
														<div className="w-6 h-6 rotate-45 border-[1.5px] border-amber-100 bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 shadow-[0_0_10px_rgba(245,158,11,0.8)] rounded-[2px]" />
													</div>
												)}
												{i >= 3 &&
													card.rarity !== "champion" &&
													card.rarity !== "hero" &&
													!card.hasHeroForm &&
													!card.hasEvolution && (
														<div className="diamond-badge bg-indigo-600 border-indigo-300 shadow-indigo-500/50">
															<Star className="-rotate-45 w-3.5 h-3.5 text-white fill-white" />
														</div>
													)}

												<div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 py-0.5 text-center border-t border-slate-700">
													<span className="text-[7px] font-black uppercase text-slate-300 leading-none truncate px-1">
														{card.name}
													</span>
												</div>
											</motion.div>
										) : (
											<div className="flex flex-col items-center gap-1">
												{isEvoSlot ? (
													<Zap className="w-5 h-5 text-pink-500 animate-pulse" />
												) : isHeroSlot ? (
													<div className="relative w-7 h-7 rotate-45 border-2 border-indigo-500 bg-indigo-900 rounded-[2px] overflow-hidden flex items-center justify-center shadow-inner">
														<div className="w-4 h-4 bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 rounded-[1px] shadow-[0_0_8px_rgba(245,158,11,0.6)] border border-amber-200/50" />
													</div>
												) : isWildSlot ? (
													<Star className={cn("w-5 h-5 animate-pulse", currentPreference === "evo" ? "text-purple-500" : "text-yellow-500")} />
												) : (
													<div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center">
														<Search className="w-3 h-3 text-slate-600" />
													</div>
												)}
												<span
													className={cn(
														"text-[7px] uppercase font-black tracking-tighter opacity-40",
														isEvoSlot
															? "text-pink-400"
															: isHeroSlot
																? "text-amber-400"
																: isWildSlot
																	? currentPreference === "evo" ? "text-purple-400" : "text-yellow-400"
																	: "text-slate-500",
													)}
												>
													{slot.label}
												</span>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>

					<div className="flex flex-col md:flex-row gap-6 items-start border-t border-slate-800 pt-6">
						<div className="flex-1 w-full space-y-4">
							<AnimatePresence>
								{deckHealth.length > 0 && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										className="space-y-2 overflow-hidden"
									>
										<div className="text-[10px] uppercase font-black text-slate-500 mb-1 flex items-center gap-1">
											<ShieldAlert className="w-3 h-3" />
											Live Deck Warnings
										</div>
										{deckHealth.map((warning, idx) => (
											<motion.div
												key={idx}
												initial={{ x: -10, opacity: 0 }}
												animate={{ x: 0, opacity: 1 }}
												transition={{ delay: idx * 0.1 }}
												className={cn(
													"p-3 rounded-xl text-xs font-bold border flex items-start gap-2",
													warning.type === "problem"
														? "bg-rose-500/10 border-rose-500/30 text-rose-300"
														: "bg-amber-500/10 border-amber-500/30 text-amber-300",
												)}
											>
												<div
													className={cn(
														"w-2 h-2 rounded-full mt-1 shrink-0",
														warning.type === "problem"
															? "bg-rose-500"
															: "bg-amber-500",
													)}
												/>
												{warning.message}
											</motion.div>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<div className="w-full md:w-64 space-y-4 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-6">
							<div className="flex items-center justify-between text-sm">
								<span className="text-slate-400 capitalize">Avg Elixir</span>
								<span className="font-mono text-2xl font-black text-indigo-400 drop-shadow-sm">
									{avgElixir}
								</span>
							</div>

							<Button
								className="w-full text-sm font-bold shadow-indigo-500/20 shadow-xl py-6"
								disabled={
									deck.filter((c) => c !== null).length < 8 || isAnalyzing
								}
								onClick={runAnalysis}
							>
								{isAnalyzing ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										Analyzing...
									</div>
								) : (
									<div className="flex items-center gap-2">
										<TrendingUp className="w-5 h-5" />
										Run AI Scan
									</div>
								)}
							</Button>
						</div>
					</div>

					{analysis && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mt-6 pt-6 border-t border-slate-800 space-y-4"
						>
							<div className="flex items-center justify-between">
								<span className="text-sm text-slate-400">Synergy Score</span>
								<span
									className={cn(
										"px-2 py-0.5 rounded text-xs font-bold",
										analysis.winRateEstimate > 70
											? "bg-emerald-500/20 text-emerald-400"
											: analysis.winRateEstimate > 50
												? "bg-amber-500/20 text-amber-400"
												: "bg-rose-500/20 text-rose-400",
									)}
								>
									{analysis.winRateEstimate}% Est. Win Rate
								</span>
							</div>
						</motion.div>
					)}
				</div>
			</div>

			{/* AI Deck Generator */}
			<div className="w-full bg-slate-900 border border-indigo-500/30 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
				<div className="flex flex-col md:flex-row gap-6 items-center">
					<div className="flex-1 w-full space-y-2">
						<h3 className="text-xl font-display font-black flex items-center gap-2 italic text-white uppercase tracking-tighter">
							<Sparkles className="w-5 h-5 text-indigo-400" />
							AI Deck Generator
						</h3>
						<p className="text-xs text-slate-400">
							Describe your preferred playstyle (e.g. "I want a fast cycle deck with Hog Rider and Firecracker" or "A defensive beatdown deck") and the AI will build it for you.
						</p>
					</div>
					<div className="w-full md:w-2/3 flex flex-col md:flex-row gap-3">
						<input
							type="text"
							placeholder="Describe your ideal deck..."
							className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
							value={generatorPrompt}
							onChange={(e) => setGeneratorPrompt(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAiGenerate()}
						/>
						<Button
							className="text-sm font-bold shadow-indigo-500/20 shadow-xl min-w-[140px]"
							onClick={handleAiGenerate}
							disabled={isGeneratingDeck || !generatorPrompt.trim()}
						>
							{isGeneratingDeck ? (
								<div className="flex items-center gap-2 justify-center">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Building...
								</div>
							) : (
								"Generate Deck"
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Card Selection Grid */}
			<div className="w-full space-y-6">
				<div className="space-y-4">
					<div className="flex flex-col md:flex-row gap-4 items-center">
						<div className="relative flex-1 w-full">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
							<input
								type="text"
								placeholder="Search cards (Hog Rider, Log...)"
								className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-display"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div className="flex gap-2 items-center">
							<label className="text-[10px] uppercase font-bold text-slate-500 mr-2">
								Sort:
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value as any)}
								className="bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
							>
								<option value="name">Name</option>
								<option value="rarity">Rarity (High-Low)</option>
								<option value="elixir">Elixir (Low-High)</option>
							</select>
						</div>
					</div>

					<div className="flex flex-wrap gap-2 items-center">
						<div className="flex gap-1 pr-4 border-r border-slate-800">
							{["all", "troop", "spell", "building"].map((t) => (
								<button
									key={t}
									onClick={() => setFilter(t as any)}
									className={cn(
										"px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all",
										filter === t
											? "bg-indigo-600 text-white"
											: "bg-slate-900 text-slate-400 hover:bg-slate-800",
									)}
								>
									{t}s
								</button>
							))}
						</div>

						<div className="flex gap-1 pl-2 overflow-x-auto pb-1 md:pb-0">
							{[
								"all",
								"common",
								"rare",
								"epic",
								"legendary",
								"champion",
								"hero",
							].map((r) => (
								<button
									key={r}
									onClick={() => setRarityFilter(r as any)}
									className={cn(
										"px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all border",
										rarityFilter === r
											? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
											: "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300",
									)}
								>
									{r}
								</button>
							))}
						</div>

						<div className="ml-auto text-[10px] text-slate-500 font-bold uppercase">
							Total Cards: {cards.length}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
					<AnimatePresence>
						{filteredCards.map((card) => {
							const isSelected = deck.some((c) => c?.id === card.id);
							const isBeingDragged =
								activeDragId === card.id && draggedFromIndex === null;

							let previewImg = card.image;
							let showsEvoBadge = card.hasEvolution;
							let showsHeroBadge =
								card.rarity === "champion" ||
								card.rarity === "hero" ||
								card.hasHeroForm;

							if (isBeingDragged && hoveredSlotIndex !== null) {
								const previewSlotIndex = hoveredSlotIndex;
								const isEvoSlot = previewSlotIndex === 0;
								const isHeroSlot = previewSlotIndex === 1;
								const isWildSlot = previewSlotIndex === 2;
								const currentPreference =
									slotTransformPreferences[previewSlotIndex];

								const isPreviewEvo =
									isEvoSlot ||
									(isWildSlot &&
										currentPreference === "evo" &&
										card.hasEvolution);
								const isPreviewHero =
									isHeroSlot ||
									(isWildSlot &&
										currentPreference === "hero" &&
										(card.rarity === "champion" ||
											card.rarity === "hero" ||
											card.hasHeroForm));

								if (isPreviewEvo && card.hasEvolution) {
									const evoCard = cards.find(
										(c) =>
											(c.name.includes("Evo") && c.name.includes(card.name)) ||
											c.id === `evo-${card.id}`,
									);
									previewImg = evoCard
										? evoCard.image
										: card.image.replace(".png", "-ev1.png");
									showsHeroBadge = false; // Hide hero badge if showing evo
								} else if (
									isPreviewHero &&
									(card.rarity === "champion" ||
										card.rarity === "hero" ||
										card.hasHeroForm)
								) {
									previewImg = `https://cdn.royaleapi.com/static/img/cards-150/${card.id}-hero.png`;
									showsEvoBadge = false; // Hide evo badge if showing hero form
								} else {
									showsEvoBadge = card.hasEvolution;
									showsHeroBadge =
										card.rarity === "champion" ||
										card.rarity === "hero" ||
										card.hasHeroForm;
								}
							}

							const isPreviewEvoFinal =
								isBeingDragged &&
								hoveredSlotIndex !== null &&
								!showsHeroBadge &&
								showsEvoBadge;
							const isPreviewHeroFinal =
								isBeingDragged &&
								hoveredSlotIndex !== null &&
								!showsEvoBadge &&
								showsHeroBadge;

							return (
								<motion.div
									layoutId={isSelected ? `library-card-${card.id}` : `card-${card.id}`}
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									whileHover={{ scale: 1.05, zIndex: 50 }}
									whileDrag={{ scale: 1.1, zIndex: 100, rotate: 5 }}
									drag
									dragSnapToOrigin
									onDragStart={() => setActiveDragId(card.id)}
									onDrag={handleDrag}
									onDragEnd={(e, info) => handleDragEnd(e, info, card)}
									key={card.id}
									onClick={() => toggleCard(card)}
									className={cn(
										"aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-between p-2 cursor-pointer transition-all group relative touch-none",
										isSelected
											? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10"
											: `card-${card.rarity} border-opacity-20 hover:border-opacity-100`,
										isPreviewEvoFinal && "evolved-glow",
										isPreviewHeroFinal && "hero-glow",
									)}
								>
									<div className="flex-1 flex items-center justify-center w-full min-h-0 relative">
										<img
											src={previewImg}
											alt={card.name}
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												if (!target.dataset.fallbackApplied) {
													target.dataset.fallbackApplied = "true";
													target.src = card.image;
													if (showsHeroBadge || isPreviewHeroFinal) {
														target.classList.add("hero-tint");
													}
												}
											}}
											onLoad={(e) => {
												const target = e.target as HTMLImageElement;
												if (!target.dataset.fallbackApplied) {
													target.classList.remove("hero-tint");
												}
												// Reset fallback on successful new load
												target.dataset.fallbackApplied = "";
											}}
											className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform"
										/>
										{/* Diamond overlays in grid */}
										{showsEvoBadge && (
											<div className="diamond-badge bg-pink-600 border-pink-400 shadow-pink-500/50 -top-2">
												<Zap className="-rotate-45 w-3.5 h-3.5 text-white fill-white" />
											</div>
										)}
										{showsHeroBadge && (
											<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] z-30">
												<div className="w-5 h-5 rotate-45 border-[1.5px] border-amber-100 bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 shadow-[0_0_8px_rgba(245,158,11,0.8)] rounded-[2px]" />
											</div>
										)}
									</div>
									<div className="w-full flex items-center justify-between mt-1">
										<span className="text-[10px] uppercase font-bold truncate pr-1 flex items-center gap-1">
											{(card.rarity === "champion" ||
												card.rarity === "hero" ||
												card.hasHeroForm) && (
												<Crown className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
											)}
											{card.name}
										</span>
										<div className="bg-indigo-950/80 px-1 rounded flex items-center gap-0.5 border border-indigo-500/30">
											<span className="text-[10px] font-bold text-indigo-300">
												{card.elixir || "?"}
											</span>
											<Zap className="w-2.5 h-2.5 text-indigo-400 fill-indigo-400" />
										</div>
									</div>
									<div className="absolute top-1 left-0 right-0 px-1 flex justify-between pointer-events-none">
										{card.rarity === "champion" ||
										card.rarity === "hero" ||
										card.hasHeroForm ? (
											<div className="bg-amber-600 text-[8px] font-black uppercase px-1 rounded shadow-sm">
												{card.rarity === "champion" ? "CHAMP" : "HERO"}
											</div>
										) : (
											<div />
										)}
										{card.hasEvolution ? (
											<div className="bg-pink-600 text-[8px] font-black uppercase px-1 rounded shadow-sm">
												EVO
											</div>
										) : (
											<div />
										)}
									</div>
									{isSelected && (
										<div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1 rounded-full shadow-lg">
											<Sword className="w-3 h-3" />
										</div>
									)}

									{/* Tooltip Modal */}
									<div className="absolute hidden lg:group-hover:flex flex-col bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-56 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-[200] text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-slate-700">
										<div className="font-bold text-sm text-white mb-1 flex items-center justify-between">
											<span className="truncate pr-2">{card.name}</span>
											<span className="text-indigo-300 text-xs flex items-center gap-0.5 shrink-0 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-500/20 font-black">
												{card.elixir}{" "}
												<Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
											</span>
										</div>
										<div className="text-[11px] text-slate-400 font-medium leading-relaxed whitespace-normal mb-3 tracking-wide drop-shadow-sm">
											{card.description || "A mighty card in the arena."}
										</div>
										<div className="flex items-center justify-between mt-auto">
											<div
												className={cn(
													"text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border",
													card.rarity === "common" &&
														"bg-slate-500/20 text-slate-300 border-slate-500/30",
													card.rarity === "rare" &&
														"bg-orange-500/20 text-orange-400 border-orange-500/30",
													card.rarity === "epic" &&
														"bg-purple-500/20 text-purple-400 border-purple-500/30",
													card.rarity === "legendary" &&
														"bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
													card.rarity === "hero" &&
														"bg-amber-500/20 text-amber-400 border-amber-500/30",
													card.rarity === "champion" &&
														"bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
												)}
											>
												{card.rarity}
											</div>
											<div className="text-[9px] font-black uppercase text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 tracking-wider">
												{card.type}
											</div>
										</div>
									</div>
								</motion.div>
							);
						})}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

const TipItem = ({
	tip,
}: {
	tip: { type: "problem" | "warning"; message: string };
}) => {
	return (
		<div className="flex items-center bg-slate-950/40 rounded-xl overflow-hidden border border-white/5 mb-2 group hover:border-indigo-500/30 transition-all">
			<div
				className={cn(
					"w-24 shrink-0 px-4 py-4 text-[10px] font-black uppercase tracking-wider flex items-center justify-center text-white text-center h-full self-stretch",
					tip.type === "problem" ? "bg-rose-900/80" : "bg-orange-800/80",
				)}
			>
				{tip.type}
			</div>
			<div className="flex-1 px-4 py-4 text-slate-100 font-medium text-sm leading-snug">
				{tip.message}
			</div>
			<div className="px-4 py-2 shrink-0">
				<button className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase px-3 py-2 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95 whitespace-nowrap">
					Let's fix it!
				</button>
			</div>
		</div>
	);
};

const RatingItem = ({ label, score }: { label: string; score: number }) => {
	const getRating = (s: number) => {
		if (s >= 9)
			return {
				text: "Godly!",
				className:
					"bg-gradient-to-r from-pink-400 via-yellow-200 to-pink-300 bg-clip-text text-transparent font-black tracking-tight",
			};
		if (s >= 7.5)
			return { text: "Great", className: "text-emerald-400 font-bold" };
		if (s >= 6) return { text: "Good", className: "text-green-500 font-bold" };
		if (s >= 4)
			return { text: "Mediocre", className: "text-amber-500 font-bold" };
		if (s >= 2) return { text: "Bad", className: "text-orange-500 font-bold" };
		return { text: "RIP", className: "text-rose-600 font-black" };
	};

	const rating = getRating(score);

	return (
		<div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
			<span className="text-slate-400 font-medium text-lg">{label}</span>
			<span
				className={cn("text-2xl transition-all duration-300", rating.className)}
			>
				{rating.text}
			</span>
		</div>
	);
};

const AnalysisView = ({
	deck,
	analysis,
	isAnalyzing,
}: {
	deck: (Card | null)[];
	analysis: DeckAnalysis | null;
	isAnalyzing: boolean;
}) => {
	if (isAnalyzing) {
		const validCards = deck.filter((c): c is Card => c !== null);
		
		const goblinCount = validCards.filter(c => c.name.toLowerCase().includes('goblin')).length;
		const skeletonCount = validCards.filter(c => c.name.toLowerCase().includes('skeleton') || c.name.toLowerCase().includes('graveyard') || c.name.toLowerCase().includes('tombstone') || c.name.toLowerCase().includes('witch') || c.name.toLowerCase().includes('balloon')).length;
		
		let CharacterIcon = Zap;
		let iconColor = "text-indigo-500 fill-indigo-500/20";
		let borderColor = "border-t-indigo-500";
		
		if (goblinCount >= 2 && goblinCount > skeletonCount) {
			CharacterIcon = (props: any) => (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          			<path d="M7 6c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z" />
          			<path d="M10 8c1.66 0 3-1.34 3-3V2" />
          			<path d="M2.5 10.5C2.5 13 4 17 4 17l4-2" />
          			<path d="M21.5 10.5C21.5 13 20 17 20 17l-4-2" />
          			<circle cx="9" cy="6" r="1" />
          			<circle cx="15" cy="6" r="1" />
          			<path d="M12 9c-1 0-2 .5-2 1h4c0-.5-1-1-2-1z" />
        		</svg>
			);
			iconColor = "text-emerald-500 fill-emerald-500/20";
			borderColor = "border-t-emerald-500";
		} else if (skeletonCount >= 2) {
			CharacterIcon = Skull;
			iconColor = "text-rose-500 fill-rose-500/20";
			borderColor = "border-t-rose-500";
		}

		return (
			<div className="flex flex-col items-center justify-center py-20 px-4">
				<div className="relative">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
						className={`w-24 h-24 border-4 border-slate-500/10 ${borderColor} rounded-full`}
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						<CharacterIcon className={`w-10 h-10 animate-pulse ${iconColor}`} />
					</div>
				</div>
				<h2 className="text-3xl font-display font-black mt-10 text-slate-100 uppercase tracking-widest animate-pulse">
					Scanning Deck
				</h2>
				<p className="text-slate-500 mt-3 text-sm max-w-sm text-center font-medium leading-relaxed italic">
					Our AI is simulating millions of card interactions and evaluating
					defensive depth and synergy...
				</p>
			</div>
		);
	}

	if (!analysis) {
		return (
			<div className="flex flex-col items-center justify-center py-20 px-8 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-800 shadow-inner max-w-xl mx-auto">
				<div className="w-16 h-16 bg-slate-900/50 rounded-2xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
					<ShieldAlert className="w-8 h-8 text-slate-700" />
				</div>
				<h3 className="text-2xl font-display font-bold text-slate-400 uppercase tracking-tight">
					No Active Scan
				</h3>
				<p className="text-slate-600 mt-3 text-center font-medium leading-relaxed max-w-xs italic">
					Complete your 8-card deck and click "Run AI Scan" to identify
					vulnerabilities and get expert meta advice.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 max-w-2xl mx-auto">
			{/* Tips Section */}
			<section className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-xl">
				<div className="flex items-center gap-3 mb-2">
					<div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg border border-white/10 text-xl">
						😎
					</div>
					<h2 className="text-3xl font-display font-black text-slate-100 uppercase tracking-tight">
						Deck Tips
					</h2>
				</div>
				<p className="text-slate-500 text-sm mb-8 font-medium italic">
					Following recommendations are only guidelines on how to improve your
					deck. It may work fine as it is.
				</p>

				<div className="space-y-2">
					{analysis.tips.map((tip, i) => (
						<TipItem key={i} tip={tip} />
					))}
				</div>
			</section>

			{/* Qualitative Ratings Card */}
			<section className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5 shadow-2xl backdrop-blur-xl">
				<h2 className="text-3xl font-display font-bold text-slate-100 mb-8 tracking-tight">
					Deck Check Rating
				</h2>

				<div className="space-y-1">
					<RatingItem label="Attack" score={analysis.stats.attack} />
					<RatingItem label="Defense" score={analysis.stats.defense} />
					<RatingItem label="Synergy" score={analysis.stats.synergy} />
					<RatingItem label="Versatility" score={analysis.stats.versatility} />
					<RatingItem label="F2P score" score={analysis.stats.f2pScore} />
				</div>

				<div className="mt-8 pt-6">
					<h4 className="text-slate-500 text-lg font-medium mb-4">Why?</h4>
					<div className="prose prose-invert prose-sm max-w-none text-slate-400 leading-relaxed">
						<ReactMarkdown>{analysis.explanation}</ReactMarkdown>
					</div>
				</div>
			</section>

			{/* Vulnerabilities & Advice */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<section className="bg-slate-900/50 p-6 rounded-3xl border border-white/5">
					<h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-rose-400">
						<ShieldAlert className="w-5 h-5" />
						Vulnerabilities
					</h3>
					<ul className="space-y-3">
						{analysis.vulnerabilities.map((v, i) => (
							<li key={i} className="flex gap-2 text-sm text-slate-400">
								<span className="text-rose-500">•</span>
								{v}
							</li>
						))}
					</ul>
				</section>

				<section className="bg-slate-900/50 p-6 rounded-3xl border border-white/5">
					<h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-indigo-400">
						<TrendingUp className="w-5 h-5" />
						Swaps
					</h3>
					<div className="flex flex-wrap gap-2">
						{analysis.recommendations.map((r, i) => (
							<span
								key={i}
								className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold border border-indigo-500/20"
							>
								{r}
							</span>
						))}
					</div>
				</section>
			</div>

			<div className="bg-indigo-600/10 p-6 rounded-3xl border border-indigo-500/20 text-center">
				<h2 className="text-3xl font-display font-bold text-indigo-400 mb-1">
					{analysis.winRateEstimate}%
				</h2>
				<p className="text-xs font-bold uppercase tracking-widest text-indigo-500/60">
					Success Probability
				</p>
			</div>
		</div>
	);
};

const MetaDecksView = ({
	setDeck,
}: {
	setDeck: (deck: (Card | null)[]) => void;
}) => {
	const metaDecks = META_DECKS;
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="space-y-8">
			<div className="bg-slate-900 border-4 border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
				<div className="flex items-center gap-3 mb-4">
					<Trophy className="w-8 h-8 text-emerald-400" />
					<h2 className="text-3xl font-black text-white tracking-tight">
						Current Meta
					</h2>
				</div>
				<p className="text-slate-400 font-medium">
					The most dominant and popular decks in the current Clash Royale meta.
				</p>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
				{loading ? (
					[...Array(4)].map((_, i) => <DeckSkeleton key={i} />)
				) : (
					metaDecks.map((deck) => {
						const deckCards = getCardsForDeck(deck.cardIds);
						const avgElixir = (
							deckCards.reduce((sum, c) => sum + c.elixir, 0) / 8
						).toFixed(1);
						return (
							<div
								key={deck.id}
								className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col group relative overflow-hidden"
							>
							<div className="absolute top-0 left-0 w-1 h-full bg-slate-800 group-hover:bg-emerald-500 transition-colors" />
							<div className="pl-4">
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-bold text-xl text-slate-100">
										{deck.name}
									</h3>
									<span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
										<Activity className="w-3 h-3" />
										{deck.winRate} Win Rate
									</span>
								</div>
								<p className="text-sm text-slate-400 mb-6 font-medium">
									{deck.description}
								</p>

								<div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
									{deckCards.map((card) => (
										<div
											key={card.id}
											className="aspect-[3/4] rounded-lg border border-slate-700 bg-slate-950 relative group/card cursor-pointer flex items-center justify-center"
										>
											<img
												src={card.image}
												alt={card.name}
												className="w-full h-full object-contain drop-shadow p-1 group-hover/card:scale-110 transition-transform"
											/>

											{/* Tooltip Modal */}
											<div className="absolute hidden lg:group-hover/card:flex flex-col bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl z-[200] text-left opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-slate-700">
												<div className="font-bold text-sm text-white mb-1 flex items-center justify-between">
													<span className="truncate pr-2">{card.name}</span>
													<span className="text-indigo-300 text-xs flex items-center gap-0.5 shrink-0 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-500/20 font-black">
														{card.elixir}{" "}
														<Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
													</span>
												</div>
												<div className="text-[10px] text-slate-400 font-medium leading-relaxed whitespace-normal mb-3 tracking-wide drop-shadow-sm">
													{card.description || "A mighty card in the arena."}
												</div>
												<div className="flex items-center justify-between mt-auto">
													<div
														className={cn(
															"text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border",
															card.rarity === "common" &&
																"bg-slate-500/20 text-slate-300 border-slate-500/30",
															card.rarity === "rare" &&
																"bg-orange-500/20 text-orange-400 border-orange-500/30",
															card.rarity === "epic" &&
																"bg-purple-500/20 text-purple-400 border-purple-500/30",
															card.rarity === "legendary" &&
																"bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
															card.rarity === "hero" &&
																"bg-amber-500/20 text-amber-400 border-amber-500/30",
															card.rarity === "champion" &&
																"bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
														)}
													>
														{card.rarity}
													</div>
													<div className="text-[8px] font-black uppercase text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 tracking-wider">
														{card.type}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>

								<div className="flex items-center justify-between pt-4 border-t border-slate-800">
									<div className="flex items-center gap-4">
										<span className="text-sm text-slate-400 flex items-center gap-1 font-medium bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
											{avgElixir} Avg
										</span>
										<span className="text-xs text-slate-500 font-bold bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
											{deck.useRate} Use Rate
										</span>
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={() => {
												setDeck(deckCards);
												navigate("/", { state: { runAnalysis: true } });
											}}
											className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shadow-sm flex items-center gap-1 font-bold text-sm transition-colors border border-slate-700"
										>
											<TrendingUp className="w-4 h-4" /> Analyze
										</button>
										<button
											onClick={() => {
												setDeck(deckCards);
												navigate("/");
											}}
											className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg flex items-center gap-1 font-bold text-sm transition-colors"
										>
											<Sword className="w-4 h-4" /> Copy to Builder
										</button>
									</div>
								</div>
							</div>
						</div>
					);
				})
				)}
			</div>
		</div>
	);
};

const DeckSkeleton = () => (
	<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 animate-pulse">
		<div className="flex justify-between items-start mb-4">
			<div className="space-y-2">
				<div className="h-6 w-48 bg-slate-800 rounded"></div>
				<div className="h-4 w-32 bg-slate-800 rounded"></div>
			</div>
			<div className="h-6 w-16 bg-slate-800 rounded-full"></div>
		</div>
		<div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
			{[...Array(8)].map((_, i) => (
				<div key={i} className="aspect-[3/4] bg-slate-800 rounded-lg"></div>
			))}
		</div>
		<div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
			<div className="flex gap-2">
				<div className="h-8 w-16 bg-slate-800 rounded-lg"></div>
				<div className="h-8 w-16 bg-slate-800 rounded-lg"></div>
			</div>
			<div className="flex gap-2">
				<div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
			</div>
		</div>
	</div>
);

const Community = ({ user }: { user: FirebaseUser | null }) => {
	const [decks, setDecks] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDecks = async () => {
			const q = query(
				collection(db, "decks"),
				where("isPublic", "==", true),
				orderBy("createdAt", "desc"),
			);
			const snapshot = await getDocs(q);

			const decksData = await Promise.all(
				snapshot.docs.map(async (docData) => {
					const deck = {
						id: docData.id,
						...docData.data(),
						userVote: null as number | null,
					};
					if (user) {
						const voteDoc = await getDoc(
							doc(db, "decks", deck.id, "votes", user.uid),
						);
						if (voteDoc.exists()) {
							deck.userVote = voteDoc.data().vote;
						}
					}
					return deck;
				}),
			);

			setDecks(decksData);
			setLoading(false);
		};
		fetchDecks();
	}, [user]);

	const handleVote = async (
		deckId: string,
		currentDeck: any,
		voteValue: 1 | -1,
	) => {
		if (!user) {
			showToast("Sign in to vote!", "error");
			return;
		}

		// Optimistic UI Update
		setDecks((prev) =>
			prev.map((d) => {
				if (d.id !== deckId) return d;
				let newUpvotes = d.upvotes || 0;
				let newDownvotes = d.downvotes || 0;
				let newUserVote: number | null = voteValue;

				if (d.userVote === voteValue) {
					// Remove vote
					if (voteValue === 1) newUpvotes--;
					else newDownvotes--;
					newUserVote = null;
				} else {
					// New or changed vote
					if (d.userVote === 1) newUpvotes--;
					else if (d.userVote === -1) newDownvotes--;

					if (voteValue === 1) newUpvotes++;
					else newDownvotes++;
				}

				return {
					...d,
					upvotes: newUpvotes,
					downvotes: newDownvotes,
					userVote: newUserVote,
				};
			}),
		);

		try {
			const voteRef = doc(db, "decks", deckId, "votes", user.uid);
			const deckRef = doc(db, "decks", deckId);
			const voteDoc = await getDoc(voteRef);

			let newUpvotes = currentDeck.upvotes || 0;
			let newDownvotes = currentDeck.downvotes || 0;

			if (voteDoc.exists()) {
				const existingVote = voteDoc.data().vote;
				if (existingVote === voteValue) {
					// Remove vote
					await deleteDoc(voteRef);
					if (voteValue === 1) newUpvotes--;
					else newDownvotes--;
				} else {
					// Change vote
					await setDoc(voteRef, {
						vote: voteValue,
						userId: user.uid,
						updatedAt: serverTimestamp(),
					});
					if (voteValue === 1) {
						newUpvotes++;
						newDownvotes--;
					} else {
						newUpvotes--;
						newDownvotes++;
					}
				}
			} else {
				// New vote
				await setDoc(voteRef, {
					vote: voteValue,
					userId: user.uid,
					createdAt: serverTimestamp(),
				});
				if (voteValue === 1) newUpvotes++;
				else newDownvotes++;
			}

			await setDoc(
				deckRef,
				{ upvotes: newUpvotes, downvotes: newDownvotes },
				{ merge: true },
			);
		} catch (error) {
			console.error("Voting failed", error);
			showToast("Failed to save your vote.", "error");
		}
	};

	if (loading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<DeckSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
			{decks.map((deck) => (
				<div
					key={deck.id}
					className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col"
				>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-bold text-lg text-slate-100">{deck.name || "Unnamed Deck"}</h3>
						<span className="text-xs font-medium text-slate-500">
							{new Date(deck.createdAt?.toDate()).toLocaleDateString()}
						</span>
					</div>
					<div className="grid grid-cols-4 gap-2 mb-4">
						{deck.cards?.map((cardId: string) => {
							const card = cards.find((c) => c.id === cardId);
							return (
								<div
									key={cardId}
									className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-700 bg-slate-950"
								>
									{card && (
										<img
											src={card.image}
											alt={card.name}
											className="w-full h-full object-contain drop-shadow"
										/>
									)}
								</div>
							);
						})}
					</div>
					<div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
						<span className="text-sm text-indigo-400 flex items-center gap-1 font-medium">
							<User className="w-3 h-3" />
							{deck.creatorName || "Anonymous"}
						</span>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-inner">
								<button
									onClick={() => handleVote(deck.id, deck, 1)}
									className={cn(
										"p-1.5 rounded-md hover:bg-slate-800 transition-colors",
										deck.userVote === 1
											? "text-emerald-400 bg-emerald-500/10"
											: "text-slate-400 hover:text-emerald-400",
									)}
								>
									<ThumbsUp className="w-4 h-4" />
								</button>
								<span
									className={cn(
										"font-bold text-sm min-w-[20px] text-center",
										(deck.upvotes || 0) - (deck.downvotes || 0) > 0
											? "text-emerald-400"
											: (deck.upvotes || 0) - (deck.downvotes || 0) < 0
												? "text-rose-400"
												: "text-slate-300",
									)}
								>
									{(deck.upvotes || 0) - (deck.downvotes || 0)}
								</span>
								<button
									onClick={() => handleVote(deck.id, deck, -1)}
									className={cn(
										"p-1.5 rounded-md hover:bg-slate-800 transition-colors",
										deck.userVote === -1
											? "text-rose-400 bg-rose-500/10"
											: "text-slate-400 hover:text-rose-400",
									)}
								>
									<ThumbsDown className="w-4 h-4" />
								</button>
							</div>
							<button
								onClick={() => {
									navigator.clipboard.writeText(
										`Check out my Clash Royale deck: ${deck.name} on Deck Builder Pro!`,
									);
									showToast("Deck info copied to clipboard!", "success");
								}}
								className="p-2 border border-slate-800 rounded-lg bg-slate-950 hover:bg-slate-800 hover:text-white text-slate-500 transition-all shadow-sm"
								title="Share Deck"
							>
								<Share2 className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

const Profile = ({ user }: { user: FirebaseUser | null }) => {
	const [playerTag, setPlayerTag] = useState("");
	const [savedDecks, setSavedDecks] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user) {
			const fetchUserData = async () => {
				const userDoc = await getDoc(doc(db, "users", user.uid));
				if (userDoc.exists()) {
					setPlayerTag(userDoc.data().playerTag || "");
				}

				const q = query(
					collection(db, "decks"),
					where("creatorId", "==", user.uid),
				);
				const snapshot = await getDocs(q);
				setSavedDecks(
					snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
				);
			};
			fetchUserData();
		}
	}, [user]);

	const savePlayerTag = async () => {
		if (!user) return;
		setLoading(true);
		try {
			await setDoc(doc(db, "users", user.uid), { playerTag }, { merge: true });
			showToast("Player tag saved successfully!", "success");
		} catch (e: any) {
			console.error("Error saving player tag:", e);
			showToast("Failed to save player tag.", "error");
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return (
			<div className="p-20 text-center space-y-6">
				<Users className="w-16 h-16 text-slate-700 mx-auto" />
				<h2 className="text-2xl font-display font-bold">
					Sign in to save your decks
				</h2>
				<Button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}>
					Sign in with Google
				</Button>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-12">
			<div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex items-center justify-between">
				<div className="flex items-center gap-6">
					<div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center border-4 border-slate-800 shadow-xl overflow-hidden">
						{user.photoURL ? (
							<img src={user.photoURL} alt="Profile" />
						) : (
							<User className="w-10 h-10 text-white" />
						)}
					</div>
					<div>
						<h2 className="text-2xl font-display font-bold">
							{user.displayName}
						</h2>
						<p className="text-slate-500">{user.email}</p>
					</div>
				</div>
				<Button variant="outline" onClick={() => signOut(auth)}>
					Sign Out
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<section className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 space-y-6">
					<h3 className="text-lg font-bold flex items-center gap-2">
						<TrendingUp className="w-5 h-5 text-indigo-400" />
						Game Integration
					</h3>
					<div className="space-y-4">
						<label className="text-sm text-slate-400">Player Tag</label>
						<div className="flex gap-2">
							<input
								type="text"
								placeholder="#AABBCCDD"
								className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
								value={playerTag}
								onChange={(e) => setPlayerTag(e.target.value)}
							/>
							<Button onClick={savePlayerTag} disabled={loading}>
								{loading ? "..." : "Save"}
							</Button>
						</div>
						<p className="text-xs text-slate-500 italic">
							Enter your tag to sync with Clash Royale and see recent opponents.
						</p>
					</div>
				</section>

				<section className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 space-y-4">
					<h3 className="text-lg font-bold flex items-center gap-2">
						<Crown className="w-5 h-5 text-amber-500" />
						Stats Summary
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
							<span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider">
								Saved Decks
							</span>
							<span className="text-2xl font-display font-bold">
								{savedDecks.length}
							</span>
						</div>
						<div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
							<span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider">
								Rarity Pwr
							</span>
							<span className="text-2xl font-display font-bold text-amber-400">
								Gold
							</span>
						</div>
					</div>
				</section>
			</div>

			<section className="space-y-6">
				<h3 className="text-xl font-display font-bold">Your Decks</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{savedDecks.map((deck) => (
						<div
							key={deck.id}
							className="bg-slate-900 p-6 rounded-2xl border border-slate-800 group hover:border-indigo-500 transition-colors"
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-bold text-lg">{deck.name || "Unnamed Deck"}</h3>
								<div className="flex items-center gap-2">
									{deck.isPublic && (
										<span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
											<Star className="w-3 h-3" />
											{(deck.upvotes || 0) - (deck.downvotes || 0)}
										</span>
									)}
									<span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
										{deck.avgElixir} Avg
									</span>
								</div>
							</div>
							<div className="grid grid-cols-4 gap-2">
								{deck.cards?.map((cardId: string) => {
									const card = cards.find((c) => c.id === cardId);
									return (
										<div
											key={cardId}
											className={cn(
												"aspect-[3/4] rounded-lg overflow-hidden border border-slate-700 p-1",
												card?.hasEvolution &&
													"border-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.3)]",
												card?.hasHeroForm &&
													"border-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.3)]",
											)}
										>
											{card && (
												<img
													src={card.image}
													alt={card.name}
													className="w-full h-full object-contain"
												/>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))}
					{savedDecks.length === 0 && (
						<div className="col-span-2 text-center p-12 text-slate-600 italic border border-dashed border-slate-800 rounded-3xl">
							No decks saved yet.
						</div>
					)}
				</div>
			</section>

			{playerTag && (
				<section className="space-y-6">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-display font-bold">Recent Opponents</h3>
						<span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
							Real-time meta feed
						</span>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50"
							>
								<div className="flex items-center gap-2 mb-3">
									<div className="w-6 h-6 bg-rose-500/20 rounded flex items-center justify-center text-[10px] font-bold text-rose-400">
										VS
									</div>
									<span className="text-sm font-bold text-slate-300">
										Player_{Math.floor(Math.random() * 9000 + 1000)}
									</span>
								</div>
								<div className="flex -space-x-2 overflow-hidden">
									{cards.slice(i, i + 5).map((c) => (
										<img
											key={c.id}
											src={c.image}
											className="w-8 h-10 object-contain bg-slate-950 border border-slate-800 rounded shadow-lg"
											alt=""
										/>
									))}
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
};

// --- Main App ---

export default function App() {
	const [deck, setDeck] = useState<(Card | null)[]>(Array(8).fill(null));
	const [slotTransformPreferences, setSlotTransformPreferences] = useState<
		("evo" | "hero")[]
	>(Array(8).fill("evo"));
	const [user, setUser] = useState<FirebaseUser | null>(null);
	const [analysis, setAnalysis] = useState<DeckAnalysis | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [isDark, setIsDark] = useState(true);
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
	const [isSavingDeck, setIsSavingDeck] = useState(false);

	const deckForCheck = useMemo(
		() => deck.filter((c): c is Card => c !== null),
		[deck],
	);

	const location = useLocation();

	useEffect(() => {
		if (location.state?.runAnalysis) {
			if (deckForCheck.length === 8 && !isAnalyzing) {
				runAnalysis();
				// Clear state so it doesn't run again on reload
				window.history.replaceState({}, document.title);
			}
		}
	}, [location.state, deckForCheck.length]);

	useEffect(() => {
		return onAuthStateChanged(auth, (u) => {
			setUser(u);
		});
	}, []);

	const navigate = useNavigate();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
	}, [isDark]);

	const runAnalysis = async () => {
		if (deckForCheck.length < 8) {
			showToast("Please select 8 cards for a full analysis.", "error");
			return;
		}
		setIsAnalyzing(true);
		navigate("/analysis");
		const result = await analyzeDeck(deckForCheck);
		setAnalysis(result);
		setIsAnalyzing(false);
	};

	const openSaveModal = () => {
		if (!user) {
			showToast("Please sign in to save decks.", "error");
			return;
		}
		if (deckForCheck.length < 8) {
			showToast("Need 8 cards for a complete deck.", "error");
			return;
		}
		setIsSaveModalOpen(true);
	};

	const handleSaveDeck = async (name: string, isPublic: boolean) => {
		if (!user) return;
		setIsSavingDeck(true);

		try {
			await addDoc(collection(db, "decks"), {
				name,
				cards: deckForCheck.map((c) => c.id),
				creatorId: user.uid,
				creatorName: user.displayName,
				createdAt: serverTimestamp(),
				isPublic,
				avgElixir: (
					deckForCheck.reduce((sum, c) => sum + c.elixir, 0) / 8
				).toFixed(1),
				upvotes: 0,
				downvotes: 0,
			});
			showToast("Deck saved to cloud!", "success");
			setIsSaveModalOpen(false);
		} catch (e: any) {
			console.error(e);
			showToast("Error saving deck: " + e.message, "error");
		} finally {
			setIsSavingDeck(false);
		}
	};

	return (
		<div
			className={cn(
				"min-h-screen transition-colors duration-300",
				isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900",
			)}
		>
			<GlobalToast />
			<SaveDeckModal 
				isOpen={isSaveModalOpen} 
				onClose={() => setIsSaveModalOpen(false)} 
				onSave={handleSaveDeck} 
				isSaving={isSavingDeck} 
			/>
			
			{/* Navbar */}
			<nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
				<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
					<Link to="/" className="flex items-center gap-3">
						<div className="bg-indigo-600 p-1.5 rounded-lg">
							<Crown className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
							Deck Builder Pro
						</h1>
					</Link>

					<div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
						<NavLink
							to="/"
							icon={<Sword className="w-4 h-4" />}
							label="Builder"
						/>
						<NavLink
							to="/meta"
							icon={<Trophy className="w-4 h-4" />}
							label="Meta"
						/>
						<NavLink
							to="/analysis"
							icon={<TrendingUp className="w-4 h-4" />}
							label="Analysis"
						/>
						<NavLink
							to="/community"
							icon={<Users className="w-4 h-4" />}
							label="Community"
						/>
						<NavLink
							to="/profile"
							icon={<User className="w-4 h-4" />}
							label="Profile"
						/>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={() => setIsDark(!isDark)}
							className="p-2 rounded-lg hover:bg-slate-900 transition-colors"
							aria-label="Toggle Dark Mode"
						>
							{isDark ? (
								<Sun className="w-5 h-5 text-amber-400" />
							) : (
								<Moon className="w-5 h-5 text-slate-600" />
							)}
						</button>

						{deckForCheck.length === 8 && (
							<Button
								onClick={openSaveModal}
								variant="secondary"
								className="hidden sm:flex"
							>
								<Share2 className="w-4 h-4 mr-2" />
								Save & Share
							</Button>
						)}

						{user ? (
							<Link to="/profile">
								<div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
									{user.photoURL && <img src={user.photoURL} alt="Profile" />}
								</div>
							</Link>
						) : (
							<Button
								variant="outline"
								onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
								className="text-xs"
							>
								Sign In
							</Button>
						)}
					</div>
				</div>
			</nav>

			{/* Top banner / notifications zone */}
			<div className="bg-indigo-600/10 border-b border-indigo-500/20 py-2">
				<div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
					<div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
					Live Meta Scan: Pekka Bridgespam Trending
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 py-12">
				<AnimatePresence mode="wait">
					<Routes>
						<Route
							path="/"
							element={
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
								>
									<DeckBuilder
										deck={deck}
										setDeck={setDeck}
										slotTransformPreferences={slotTransformPreferences}
										setSlotTransformPreferences={setSlotTransformPreferences}
										analysis={analysis}
										setAnalysis={setAnalysis}
										isAnalyzing={isAnalyzing}
										runAnalysis={runAnalysis}
									/>
								</motion.div>
							}
						/>
						<Route
							path="/analysis"
							element={
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
								>
									<AnalysisView deck={deck} analysis={analysis} isAnalyzing={isAnalyzing} />
								</motion.div>
							}
						/>
						<Route
							path="/meta"
							element={
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
								>
									<MetaDecksView setDeck={setDeck} />
								</motion.div>
							}
						/>
						<Route
							path="/community"
							element={
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
								>
									<Community user={user} />
								</motion.div>
							}
						/>
						<Route
							path="/profile"
							element={
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
								>
									<Profile user={user} />
								</motion.div>
							}
						/>
					</Routes>
				</AnimatePresence>
			</main>

			{/* Bottom Nav for Mobile */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 px-6 py-4 flex justify-between items-center">
				<MobNavLink to="/" icon={<Sword />} />
				<MobNavLink to="/meta" icon={<Trophy />} />
				<MobNavLink to="/analysis" icon={<Search />} />
				<MobNavLink to="/community" icon={<Users />} />
				<MobNavLink to="/profile" icon={<User />} />
				{deckForCheck.length === 8 && (
					<button
						onClick={openSaveModal}
						className="bg-indigo-600 p-2 rounded-xl text-white shadow-xl shadow-indigo-500/20"
					>
						<Share2 className="w-5 h-5" />
					</button>
				)}
			</div>

			{/* Push Notification Toast Placeholder */}
			<div className="fixed bottom-24 right-6 pointer-events-none">
				{deckForCheck.length >= 1 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9, x: 100 }}
						animate={{ opacity: 1, scale: 1, x: 0 }}
						className="bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
					>
						<div className="bg-white/20 p-1.5 rounded-lg">
							<Crown className="w-4 h-4" />
						</div>
						<div>
							<p className="text-[10px] font-bold uppercase opacity-70">
								New Update
							</p>
							<p className="text-sm font-medium">Skeleton King usage up 12%!</p>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}

function NavLink({
	to,
	icon,
	label,
}: {
	to: string;
	icon: React.ReactNode;
	label: string;
}) {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className={cn(
				"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all group",
				isActive
					? "bg-slate-800 text-white shadow-sm"
					: "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50",
			)}
		>
			<span
				className={cn(
					isActive
						? "text-indigo-400"
						: "text-slate-500 group-hover:text-slate-300",
				)}
			>
				{icon}
			</span>
			{label}
		</Link>
	);
}

function MobNavLink({ to, icon }: { to: string; icon: React.ReactNode }) {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className={cn(
				"p-2 rounded-xl transition-all",
				isActive ? "bg-indigo-600/10 text-indigo-400" : "text-slate-500",
			)}
		>
			{React.isValidElement(icon)
				? React.cloneElement(icon as React.ReactElement<any>, {
						className: "w-6 h-6",
					})
				: icon}
		</Link>
	);
}
