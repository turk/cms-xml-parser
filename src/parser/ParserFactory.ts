import { IFactory } from "./IFactory";
import { IParser } from "./IParser";
import { Wordpress } from "./Wordpress";

export class ParserFactory implements IFactory {

  public createParser(parser: string): IParser {

    switch (parser) {
      case "wordpress":
        return new Wordpress();
    }
  }
}
