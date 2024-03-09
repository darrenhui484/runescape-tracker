"use client";

import {
  Action,
  ResourcesCount,
  ResourcesCountSchema,
  SkillsCount,
  SkillsCountSchema,
  UserInteractionActionType,
  CharacterSheet,
} from "@/app/types";
import { useReducer } from "react";
import { AddButton } from "../addButton/AddButton";
import { ImageCounterListEditor } from "../imageCounterListEditor/ImageCounterListEditor";
import { modalReducer, Modal } from "../modal/Modal";
import { RemoveButton } from "../removeButton/RemoveButton";
import { SimpleCounterEditor } from "../simpleCounterEditor/SimpleCounterEditor";
import { SimpleDropdownEditor } from "../simpleDropdownEditor/SimpleDropdownEditor";
import { SimpleTextInputEditor } from "../simpleTextInputEditor/SimpleTextInputEditor";
import { z } from "zod";
import styles from "./playerCharacterSheet.module.css";
import Image from "next/image";

const localStorageSaveKey = "rs-tracker";

type PlayerCharacterSheetProps = {};
export default function PlayerCharacterSheet({}: PlayerCharacterSheetProps) {
  const emptyCharacterSheet: CharacterSheet = {
    name: "",
    wounds: 0,
    deaths: 0,
    sideQuestsCompleted: 0,
    gold: 0,
    resources: [],
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
    inventory: ["recipe book"],
  };
  const existingCharacterSheet = localStorage.getItem(localStorageSaveKey);
  const [characterSheetState, characterSheetDispatch] = useReducer(
    characterSheetReducer,
    existingCharacterSheet == null
      ? emptyCharacterSheet
      : JSON.parse(existingCharacterSheet)
  );
  const [modalState, modalDispatch] = useReducer(modalReducer, {
    isOpen: false,
    content: null,
  });

  //TODO load previous config, save current config

  function simpleCounterOnClickFactory(
    title: string,
    actionType: UserInteractionActionType
  ) {
    return () => {
      const modalContent = (
        <SimpleCounterEditor
          title={title}
          onSubmit={(delta) => {
            characterSheetDispatch({ type: actionType, payload: delta });
            modalDispatch({ type: "close" });
          }}
        />
      );
      modalDispatch({ type: "open", payload: modalContent });
    };
  }

  function onAddItem() {
    const modalContent = (
      <SimpleTextInputEditor
        title="Add Item"
        onSubmit={(newItem) => {
          characterSheetDispatch({
            type: "addItemToInventory",
            payload: newItem,
          });
          modalDispatch({ type: "close" });
        }}
      />
    );
    modalDispatch({ type: "open", payload: modalContent });
  }

  function onRemoveItem() {
    const modalContent = (
      <SimpleDropdownEditor
        title={"Remove Item"}
        items={characterSheetState.inventory}
        onSubmit={(itemToRemove) => {
          characterSheetDispatch({
            type: "removeItemFromInventory",
            payload: itemToRemove,
          });
          modalDispatch({ type: "close" });
        }}
      />
    );
    modalDispatch({ type: "open", payload: modalContent });
  }

  function onEditResources() {
    const modalContent = (
      <ImageCounterListEditor
        initialState={{
          Fish: 0,
          Meat: 0,
          Herb: 0,
          Vegetable: 0,
          Egg: 0,
          Flour: 0,
          Fruit: 0,
          Wood: 0,
          Stone: 0,
          Leather: 0,
          Thread: 0,
          Metal: 0,
        }}
        onSubmit={(resourcesCount) => {
          characterSheetDispatch({
            type: "resolveResources",
            payload: resourcesCount,
          });
          modalDispatch({ type: "close" });
        }}
      />
    );
    modalDispatch({ type: "open", payload: modalContent });
  }

  function onEditSkills() {
    const modalContent = (
      <ImageCounterListEditor
        initialState={{
          Melee: 0,
          Ranged: 0,
          Magic: 0,
          Defence: 0,
          Thieving: 0,
          Gathering: 0,
          Crafting: 0,
          Cooking: 0,
        }}
        onSubmit={(resourcesCount) => {
          characterSheetDispatch({
            type: "resolveSkills",
            payload: resourcesCount,
          });
          modalDispatch({ type: "close" });
        }}
      />
    );
    modalDispatch({ type: "open", payload: modalContent });
  }
  return (
    <>
      <div className={styles.container}>
        <div
          onClick={simpleCounterOnClickFactory("Wounds", "resolveWound")}
          className={styles.textHeading}
        >
          Wounds: {characterSheetState.wounds}
        </div>
        <div
          onClick={simpleCounterOnClickFactory("Deaths", "resolveDeath")}
          className={styles.textHeading}
        >
          Deaths: {characterSheetState.deaths}
        </div>
        <div
          onClick={simpleCounterOnClickFactory(
            "Side Quests Completed",
            "resolveSideQuestsCompleted"
          )}
          className={styles.textHeading}
        >
          Side Quests Completed: {characterSheetState.sideQuestsCompleted}
        </div>
        <div>
          <Image
            unoptimized
            onClick={simpleCounterOnClickFactory("Gold", "resolveGold")}
            height={40}
            width={40}
            src={"/resource/Gold.png"}
            alt="Gold"
          />
          {characterSheetState.gold}
        </div>

        <div onClick={onEditSkills}>
          <div className={styles.textHeading}>Skills</div>
          <div className={styles.skillGrid}>
            {characterSheetState.skills.map((skill) => {
              return (
                <>
                  <div key={skill.name}>{skill.name}</div>
                  <div key={`${skill.name}-level`}>{skill.level}</div>
                  <div key={`${skill.name}-xp`}>XP: {skill.xp}</div>
                </>
              );
            })}
          </div>
        </div>

        <div onClick={onEditResources}>
          <div className={styles.textHeading}>Resources</div>
          <div className={styles.wrappedRow}>
            {characterSheetState.resources.map((resource) => {
              const imageSource = `/resource/${resource.name}.png`;
              return (
                <div key={resource.name}>
                  <Image
                    unoptimized
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
        </div>

        <div>
          <div className={styles.row}>
            <div className={styles.textHeading}>Inventory</div>
            <RemoveButton onClick={() => onRemoveItem()} />
            <AddButton onClick={() => onAddItem()} />
          </div>
          <div className={styles.border}>
            {characterSheetState.inventory.map((item) => {
              return <div key={item}>{item}</div>;
            })}
          </div>
        </div>
      </div>
      <Modal isOpen={modalState.isOpen} content={modalState.content} />
    </>
  );
}

function characterSheetReducer(
  state: CharacterSheet,
  action: Action<
    UserInteractionActionType,
    number | string | ResourcesCount | SkillsCount
  >
): CharacterSheet {
  let newState: CharacterSheet;
  switch (action.type) {
    case "resolveWound":
      newState = handleResolveWound(state, z.number().parse(action.payload));
      break;
    case "resolveDeath":
      newState = handleResolveDeath(state, z.number().parse(action.payload));
      break;
    case "resolveSideQuestsCompleted":
      newState = handleResolveSideQuestsCompleted(
        state,
        z.number().parse(action.payload)
      );
      break;
    case "resolveGold":
      newState = handleResolveGold(state, z.number().parse(action.payload));
      break;
    case "addItemToInventory":
      newState = handleAddItemToInventory(
        state,
        z.string().parse(action.payload)
      );
      break;
    case "removeItemFromInventory":
      newState = removeItemFromInventory(
        state,
        z.string().parse(action.payload)
      );
      break;
    case "resolveResources":
      newState = handleResolveResources(
        state,
        ResourcesCountSchema.parse(action.payload)
      );
      break;
    case "resolveSkills":
      newState = handleResolveSkills(
        state,
        SkillsCountSchema.parse(action.payload)
      );
      break;
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
  localStorage.setItem(localStorageSaveKey, JSON.stringify(newState));
  return newState;
}

function handleResolveSkills(state: CharacterSheet, skillsCount: SkillsCount) {
  const newState = structuredClone(state);

  const skillKeys = Object.keys(skillsCount) as Array<keyof SkillsCount>;
  skillKeys.forEach((skillKey) => {
    const skillState = newState.skills.find((skill) => skill.name === skillKey);
    if (skillState == null) {
      throw new Error("unable to find skill state");
    }
    const xpDelta = skillsCount[skillKey];
    const totalXp = Math.max(skillState.level * 3 + skillState.xp + xpDelta, 3);
    skillState.xp = totalXp % 3;
    skillState.level = Math.floor(totalXp / 3);
  });
  return newState;
}

function handleResolveResources(
  state: CharacterSheet,
  resourcesCount: ResourcesCount
) {
  const resourceKeys = Object.keys(resourcesCount) as Array<
    keyof ResourcesCount
  >;
  const newState = structuredClone(state);
  resourceKeys.forEach((resourceKey) => {
    const delta = resourcesCount[resourceKey];
    const resourceState = newState.resources.find(
      (resource) => resource.name === resourceKey
    );
    if (delta === 0) {
      return;
    } else if (delta < 0) {
      if (resourceState == null) {
        return;
      }
      const newAmount = resourceState.amount + delta;

      if (newAmount <= 0) {
        newState.resources = newState.resources.filter(
          (resource) => resource.name !== resourceKey
        );
        return;
      }
      resourceState.amount = newAmount;
    } else {
      // delta > 0
      if (resourceState == null) {
        newState.resources.push({
          name: resourceKey,
          amount: delta,
        });
        return;
      }
      resourceState.amount = resourceState.amount + delta;
    }
  });
  return newState;
}

function handleAddItemToInventory(state: CharacterSheet, payload: string) {
  state.inventory.push(payload);
  return { ...state, inventory: state.inventory };
}

function removeItemFromInventory(state: CharacterSheet, payload: string) {
  const indexToRemove = state.inventory.indexOf(payload);
  if (indexToRemove == -1) {
    return { ...state };
  }
  state.inventory.splice(indexToRemove, 1);
  return { ...state, inventory: state.inventory };
}

function handleResolveGold(state: CharacterSheet, payload: number) {
  const delta = payload;
  return { ...state, gold: Math.max(state.gold + delta, 0) };
}

function handleResolveDeath(state: CharacterSheet, payload: number) {
  const delta = payload;
  return { ...state, deaths: Math.max(state.deaths + delta, 0) };
}

function handleResolveSideQuestsCompleted(
  state: CharacterSheet,
  payload: number
) {
  const delta = payload;
  return { ...state, sideQuestsCompleted: Math.max(state.sideQuestsCompleted + delta, 0) };
}

function handleResolveWound(state: CharacterSheet, payload: number) {
  const delta = payload;
  if (delta === 0) {
    return { ...state };
  }
  const totalWounds = state.wounds + state.deaths * 3 + delta;
  if (delta > 0) {
    return {
      ...state,
      wounds: totalWounds % 3,
      deaths: Math.floor(totalWounds / 3),
    };
  }
  return {
    ...state,
    wounds: Math.max(state.wounds + delta, 0),
  };
}
