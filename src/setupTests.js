// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { configure } from "@testing-library/react";

import { initializeIcons } from "@uifabric/icons";

// Mock window.scrollTo for tests
const noop = () => {};
Object.defineProperty(window, "scrollTo", { value: noop, writable: true });
window.URL.createObjectURL = noop;

// Register icons for any components that may try to import them
initializeIcons();

configure({ testIdAttribute: "data-cy" });
