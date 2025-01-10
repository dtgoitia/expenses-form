import { Shortcut } from "./domain/model";

export const SHORTCUTS: Shortcut[] = [
  {
    id: 1,
    buttonName: "Sainsbury's",
    main: "Groceries",
    people: ["AngelaPerez"],
    seller: "Sainsburys",
    tags: ["groceries"],
  },
  {
    id: 2,
    buttonName: "Morrisons's",
    main: "Groceries",
    people: ["AngelaPerez"],
    seller: "Morrisons",
    tags: ["groceries"],
  },
  {
    id: 3,
    buttonName: "Lidl",
    main: "Groceries",
    people: ["AngelaPerez"],
    seller: "Lidl",
    tags: ["groceries"],
  },
  {
    id: 4,
    buttonName: "Tesco",
    main: "Groceries",
    people: ["AngelaPerez"],
    seller: "Tesco",
    tags: ["groceries"],
  },
  {
    id: 5,
    buttonName: "TfL",
    main: "Transport",
    people: [],
    seller: "TfL",
    tags: ["transport"],
  },
  {
    id: 6,
    buttonName: "Move",
    main: "Move money between accounts",
    people: [],
    seller: "",
    tags: [],
  },
];

export const TAGS = [
  "expenses",
  "groceries",
  "eatout",
  "social",
  "ocio",
  "drinks",
  "invite",
  "transport",
  "health",
  "present",
  "home",
];

export const BASE_URL = "expenses-form"; // must match "homepage" field in package.json

export const SPLIT_DECIMAL_NUMBER = 2;
