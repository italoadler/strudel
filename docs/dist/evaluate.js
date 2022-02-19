import * as strudel from "../_snowpack/link/strudel.js";
import "./tone.js";
import "./midi.js";
import "./voicings.js";
import "./tonal.js";
import "./groove.js";
import shapeshifter from "./shapeshifter.js";
import {minify} from "./parse.js";
import * as Tone from "../_snowpack/pkg/tone.js";
import * as toneHelpers from "./tone.js";
const bootstrapped = {...strudel, ...strudel.Pattern.prototype.bootstrap()};
function hackLiteral(literal, names, func) {
  names.forEach((name) => {
    Object.defineProperty(literal.prototype, name, {
      get: function() {
        return func(String(this));
      }
    });
  });
}
hackLiteral(String, ["mini", "m"], bootstrapped.mini);
hackLiteral(String, ["pure", "p"], bootstrapped.pure);
Object.assign(globalThis, bootstrapped, Tone, toneHelpers);
export const evaluate = (code) => {
  const shapeshifted = shapeshifter(code);
  let evaluated = eval(shapeshifted);
  if (typeof evaluated === "function") {
    evaluated = evaluated();
  }
  const pattern = minify(evaluated);
  if (pattern?.constructor?.name !== "Pattern") {
    const message = `got "${typeof pattern}" instead of pattern`;
    throw new Error(message + (typeof pattern === "function" ? ", did you forget to call a function?" : "."));
  }
  return {mode: "javascript", pattern};
};
