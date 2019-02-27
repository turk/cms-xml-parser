import { IParser } from "./IParser";
export interface IFactory {
  createParser(name): IParser;
}
