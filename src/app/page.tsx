"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode, useReducer, useState } from "react";
import { z } from "zod";
import "./page.css";
import Image from "next/image";

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
type CharacterSheet = z.infer<typeof CharacterSheetSchema>;

type ActionType = "test" | "resolveDelta" | "incrementWound" | "decrementWound";
type Action = { type: ActionType };

export default function Home() {
  const searchParams = useSearchParams();
  const params = searchParams.get("test");
  console.log(params, searchParams);

  const emptyCharacterSheet: CharacterSheet = {
    name: "",
    wounds: 0,
    deaths: 0,
    sideQuestsCompleted: 0,
    gold: 0,
    resources: [
      { name: "Egg", amount: 2 },
      { name: "Metal", amount: 2 },
      { name: "Egg", amount: 2 },
      { name: "Metal", amount: 2 },
      { name: "Egg", amount: 2 },
      { name: "Metal", amount: 2 },
    ],
    skills: [
      {
        name: "Melee",
        xp: 0,
        level: 1,
      },
      {
        name: "Ranged",
        xp: 0,
        level: 1,
      },
      {
        name: "Magic",
        xp: 0,
        level: 1,
      },
      {
        name: "Defence",
        xp: 0,
        level: 1,
      },
      {
        name: "Thieving",
        xp: 0,
        level: 1,
      },
      {
        name: "Gathering",
        xp: 0,
        level: 1,
      },
      {
        name: "Crafting",
        xp: 0,
        level: 1,
      },
      {
        name: "Cooking",
        xp: 0,
        level: 1,
      },
    ],
    inventory: ["one handed sword", "recipe book"],
  };

  const [state, dispatch] = useReducer(reducer, emptyCharacterSheet);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  //load previous config

  function onWoundClick() {
    console.log("testes");
    const render = (
      <SimpleCounterEditor
        title="Wounds"
        currentCount={state.wounds}
        onIncrement={() => dispatch({ type: "incrementWound" })}
        onDecrement={() => dispatch({ type: "decrementWound" })}
      />
    );
    setModalContent(render);
    setIsModalOpen(true);
  }

  console.log(isModalOpen);

  return (
    <main>
      <div className="flex-col">
        <div>
          <div onClick={onWoundClick} className="text-heading">
            Wounds: {state.wounds}
          </div>
          <div className="text-heading">Deaths: {state.deaths}</div>
          <div className="text-heading">
            Side Quests Completed: {state.sideQuestsCompleted}
          </div>
          <div>
            <Image
              height={40}
              width={40}
              src={"/resource/rs-gold.png"}
              alt="Gold"
            />
            {state.gold}
          </div>
        </div>

        <div className="text-heading">Skills</div>
        <div className="skill-grid">
          {state.skills.map((skill) => {
            return (
              <>
                <div>{skill.name}</div>
                <div>{skill.level}</div>
                <div>XP: {skill.xp}</div>
              </>
            );
          })}
        </div>
        <div className="text-heading">Resources</div>
        <div className="wrapped-row">
          {state.resources.map((resource) => {
            const imageSource = `/resource/rs-${resource.name.toLowerCase()}.png`;
            return (
              <div>
                <Image
                  width={40}
                  height={40}
                  src={imageSource}
                  alt={resource.name}
                />
                {resource.amount}
              </div>
            );
          })}
        </div>
        <div className="text-heading">Inventory</div>
        <div className="border">
          {state.inventory.map((item) => {
            return <div>{item}</div>;
          })}
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        content={modalContent}
        onClose={() => {
          setModalContent(null);
          setIsModalOpen(false);
          dispatch({ type: "resolveDelta" });
        }}
      />
    </main>
  );
}

type CounterProps = {
  onIncrement: () => void;
  onDecrement: () => void;
};
function Counter({ onIncrement, onDecrement }: CounterProps) {
  return (
    <div>
      <button className="decrement-counter-button" onClick={onDecrement}>
        -
      </button>
      <button className="increment-counter-button" onClick={onIncrement}>
        +
      </button>
    </div>
  );
}

type SimpleCounterEditor = {
  title: string;
  currentCount: number;
  onIncrement: () => void;
  onDecrement: () => void;
};
function SimpleCounterEditor({
  title,
  currentCount,
  onIncrement,
  onDecrement,
}: SimpleCounterEditor) {
  return (
    <div>
      <div>
        {title}: {currentCount}
      </div>
      <Counter onIncrement={onIncrement} onDecrement={onDecrement} />
    </div>
  );
}

type ModalProps = { isOpen: boolean; content: ReactNode; onClose: () => void };
function Modal({ isOpen, content, onClose }: ModalProps) {
  const displayCss = isOpen ? { display: "block" } : { display: "none" };
  return (
    <div style={displayCss}>
      {content}
      <button onClick={onClose}>Done</button>
    </div>
  );
}

function reducer(state: CharacterSheet, action: Action): CharacterSheet {
  switch (action.type) {
    case "test":
      return { ...state, wounds: state.wounds + 1 };
    case "incrementWound":
      return { ...state, wounds: state.wounds + 1 };
    case "decrementWound":
      if (state.wounds <= 0) {
        return { ...state };
      }
      return { ...state, wounds: state.wounds - 1 };
    case "resolveDelta":
      return {
        ...state,
        wounds: state.wounds % 3,
        deaths: state.deaths + Math.floor(state.wounds / 3),
      };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
}
