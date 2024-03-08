import { ReactNode } from "react";
import { z } from "zod";
const SkillNameSchema = z.union([
  z.literal("Melee"),
  z.literal("Ranged"),
  z.literal("Magic"),
  z.literal("Defence"),
  z.literal("Thieving"),
  z.literal("Gathering"),
  z.literal("Crafting"),
  z.literal("Cooking"),
]);

const SkillSchema = z.object({
  name: SkillNameSchema,
  level: z.number().min(1).max(99),
  xp: z.number().min(0).max(2),
});

const ResourceNameSchema = z.union([
  z.literal("Fish"),
  z.literal("Meat"),
  z.literal("Herb"),
  z.literal("Vegetable"),
  z.literal("Egg"),
  z.literal("Flour"),
  z.literal("Fruit"),
  z.literal("Wood"),
  z.literal("Stone"),
  z.literal("Leather"),
  z.literal("Thread"),
  z.literal("Metal"),
]);

export const ResourcesCountSchema = z.object({
  Fish: z.number(),
  Meat: z.number(),
  Herb: z.number(),
  Vegetable: z.number(),
  Egg: z.number(),
  Flour: z.number(),
  Fruit: z.number(),
  Wood: z.number(),
  Stone: z.number(),
  Leather: z.number(),
  Thread: z.number(),
  Metal: z.number(),
});
export type ResourcesCount = z.infer<typeof ResourcesCountSchema>;

export const SkillsCountSchema = z.object({
  Melee: z.number(),
  Ranged: z.number(),
  Magic: z.number(),
  Defence: z.number(),
  Thieving: z.number(),
  Gathering: z.number(),
  Crafting: z.number(),
  Cooking: z.number(),
});
export type SkillsCount = z.infer<typeof SkillsCountSchema>;

const ResourceSchema = z.object({
  name: ResourceNameSchema,
  amount: z.number().min(0),
});

const CharacterSheetSchema = z.object({
  name: z.string(),
  wounds: z.number().min(0).max(3),
  deaths: z.number().min(0),
  sideQuestsCompleted: z.number().min(0),
  gold: z.number().min(0),
  resources: z.array(ResourceSchema),
  skills: z.array(SkillSchema),
  inventory: z.array(z.string()),
});

type Resource = z.infer<typeof ResourceSchema>;
export type CharacterSheet = z.infer<typeof CharacterSheetSchema>;
export type ModalState = {
  isOpen: boolean;
  content: ReactNode;
};

export type UserInteractionActionType =
  | "resolveGold"
  | "resolveWound"
  | "resolveDeath"
  | "resolveSideQuestsCompleted"
  | "resolveInventory"
  | "addItemToInventory"
  | "removeItemFromInventory"
  | "resolveResources"
  | "resolveSkills";
export type ModalActionType = "open" | "close";
export type Action<T, U> = { type: T; payload?: U };