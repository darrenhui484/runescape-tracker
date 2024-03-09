"use client";

import {
  Action,
  ResourcesCount,
  ResourcesCountSchema,
  SkillsCount,
  SkillsCountSchema,
  UserInteractionActionType,
  CharacterSheet,
  SkillName,
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
import { Indicator } from "../indicator/Indicator";

const localStorageSaveKey = "rs-tracker";

const meleeImage = "https://runescape.wiki/images/Attack-icon.png?93d2b";
const rangedImage = "https://runescape.wiki/images/Ranged-icon.png?310aa";
const magicImage = "https://runescape.wiki/images/Magic-icon.png?60d6d";
const defenceImage = "https://runescape.wiki/images/Defence-icon.png?8d986";
const thievingImage = "https://runescape.wiki/images/Thieving-icon.png?1fcf2";
const gatheringImage = "https://runescape.wiki/images/Backpack_icon.png?ff441";
const craftingImage = "https://runescape.wiki/images/Crafting-icon.png?f224a";
const cookingImage = "https://runescape.wiki/images/Cooking-icon.png?00812";

const lobsterImage = "https://runescape.wiki/images/Lobster.png?48782";
const rationImage = "https://runescape.wiki/images/Pork_pie.png?467bc";

const skills = ["Melee", "Ranged", "Magic", "Defence"];

function getSkillImage(skill: SkillName) {
  switch (skill) {
    case "Melee":
      return meleeImage;
    case "Ranged":
      return rangedImage;
    case "Magic":
      return magicImage;
    case "Defence":
      return defenceImage;
    case "Thieving":
      return thievingImage;
    case "Gathering":
      return gatheringImage;
    case "Crafting":
      return craftingImage;
    case "Cooking":
      return cookingImage;
    default:
      throw new Error(`Invalid skill: ${skill}`);
  }
}

function getResourceImage(resource: string) {
  if ("Lobster" === resource) {
    return lobsterImage;
  }
  if ("Ration" === resource) {
    return rationImage;
  }
  return `/resource/${resource}.png`;
}

type PlayerCharacterSheetProps = {};
export default function PlayerCharacterSheet({}: PlayerCharacterSheetProps) {
  const emptyCharacterSheet: CharacterSheet = {
    name: "",
    wounds: 0,
    deaths: 0,
    sideQuestsCompleted: 0,
    gold: 0,
    resources: [
      { name: "Fish", amount: 0 },
      { name: "Meat", amount: 0 },
      { name: "Herb", amount: 0 },
      { name: "Vegetable", amount: 0 },
      { name: "Egg", amount: 0 },
      { name: "Flour", amount: 0 },
      { name: "Fruit", amount: 0 },
      { name: "Wood", amount: 0 },
      { name: "Stone", amount: 0 },
      { name: "Leather", amount: 0 },
      { name: "Thread", amount: 0 },
      { name: "Metal", amount: 0 },
      { name: "Ration", amount: 0 },
      { name: "Lobster", amount: 0 },
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
    const initialState = characterSheetState.resources.reduce<ResourcesCount>(
      (accumulator, resource) => {
        const imageSrc = getResourceImage(resource.name);
        return Object.assign(accumulator, {
          [resource.name]: {
            count: resource.amount,
            imageSrc: imageSrc,
          },
        });
      },
      {} as ResourcesCount
    );
    const modalContent = (
      <ImageCounterListEditor
        initialState={initialState}
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
          Melee: {
            count: 0,
            imageSrc: meleeImage,
          },
          Ranged: {
            count: 0,
            imageSrc: rangedImage,
          },
          Magic: {
            count: 0,
            imageSrc: magicImage,
          },
          Defence: {
            count: 0,
            imageSrc: defenceImage,
          },
          Thieving: {
            count: 0,
            imageSrc: thievingImage,
          },
          Gathering: {
            count: 0,
            imageSrc: gatheringImage,
          },
          Crafting: {
            count: 0,
            imageSrc: craftingImage,
          },
          Cooking: {
            count: 0,
            imageSrc: cookingImage,
          },
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
          className={styles.border}
          onClick={simpleCounterOnClickFactory(
            "Side Quests Completed",
            "resolveSideQuestsCompleted"
          )}
        >
          <div className={styles.textHeading}>
            Side Quests Completed: {characterSheetState.sideQuestsCompleted}
          </div>
          <div className={styles.row}>
            <Indicator
              isOn={characterSheetState.sideQuestsCompleted >= 3}
              text="3"
            />
            <Indicator
              isOn={characterSheetState.sideQuestsCompleted >= 5}
              text="5"
            />
            <Indicator
              isOn={characterSheetState.sideQuestsCompleted >= 8}
              text="8"
            />
            <Indicator
              isOn={characterSheetState.sideQuestsCompleted >= 12}
              text="12"
            />
          </div>
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
                  <Image
                    unoptimized
                    src={getSkillImage(skill.name)}
                    alt={skill.name}
                    height={40}
                    width={40}
                  ></Image>
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
            {characterSheetState.resources.flatMap((resource) => {
              if(resource.amount <= 0){
                return []
              }
              let imageSource = getResourceImage(resource.name);

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
    const xpDelta = skillsCount[skillKey].count;
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
    const newResourceCount = resourcesCount[resourceKey].count;
    const resourceState = newState.resources.find(
      (resource) => resource.name === resourceKey
    );
    if (resourceState == null) {
      throw new Error(`nonexistent resourceState: ${resourceKey}`);
    }
    resourceState.amount = Math.max(newResourceCount, 0);
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
  return {
    ...state,
    sideQuestsCompleted: Math.max(state.sideQuestsCompleted + delta, 0),
  };
}

function handleResolveWound(state: CharacterSheet, payload: number) {
  const delta = payload;
  if (delta === 0) {
    return { ...state };
  }
  let deathModifier = state.sideQuestsCompleted >= 5 ? 4 : 3;
  const totalWounds = state.wounds + state.deaths * deathModifier + delta;
  if (delta > 0) {
    return {
      ...state,
      wounds: totalWounds % deathModifier,
      deaths: Math.floor(totalWounds / deathModifier),
    };
  }
  return {
    ...state,
    wounds: Math.max(state.wounds + delta, 0),
  };
}
