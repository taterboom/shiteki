import { ElementInfo } from "../types";
import { getElementSelector } from "./getElementSelector";

const CAPTURED_ATTRS = ["id", "class", "role", "data-testid", "href", "type", "name", "aria-label"];

export function getElementInfo(el: Element): ElementInfo {
  const rect = el.getBoundingClientRect();
  const attributes: Record<string, string> = {};

  for (const attr of CAPTURED_ATTRS) {
    const value = el.getAttribute(attr);
    if (value) {
      attributes[attr] = value;
    }
  }

  return {
    selector: getElementSelector(el),
    tagName: el.tagName.toLowerCase(),
    textContent: (el.textContent ?? "").trim().slice(0, 80),
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },
    attributes,
  };
}
