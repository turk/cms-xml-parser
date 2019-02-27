import fs from "fs";
import path from "path";
import xml2js, { processors } from "xml2js";

import config from "../config/config";
import { IParser } from "./IParser";

export class Wordpress implements IParser {
    public items = [];
    public attachment = [];
    constructor() {
        console.log("Wordpress parser started");
    }

    public async start(file: string) {
        console.log("start wordpressss");
        const xmlData = await this.load(file);
        const data = await this.xmlToJs(xmlData);

        for (const item of data.rss.channel[0].item) {
            await this.parseItem(item);
        }
    }

    public async load(file: any) {
        return fs.readFileSync(config.files.xmlPath + file, "utf8");
    }

    public async xmlToJs(xmlData: string | xml2js.convertableToString) {
        let jResult: any;
        await xml2js.parseString(xmlData, { trim: true }, (err: any, result: any) => jResult = result);
        return jResult;
    }

    public async parseItem(item: { [x: string]: any; title: any[]; }) {
        if (item["wp:post_type"][0] === "post") {
            await this.parsePost(item);
        }

        if (item["wp:post_type"][0] === "attachment") {
            await this.parseAttachment(item);
        }
    }
    public async parsePost(item: any) {
        this.items[item["wp:post_id"][0]] = {
            content: item["content:encoded"][0],
            post_date: item["wp:post_date"][0],
            postname: item["wp:post_name"][0],
            title: item.title[0],
        };

        if (item["wp:postmeta"]) {
            for (const meta of item["wp:postmeta"]) {

                if (meta["wp:meta_key"][0] === "_thumbnail_id") {
                    this.items[item["wp:post_id"][0]].image = meta["wp:meta_value"][0];
                }
            }
        }
    }

    public async parseAttachment(item: any) {
        this.attachment[item["wp:post_id"][0]] = {
            id: item["wp:post_id"][0],
            title: item.title[0],
            url: item["wp:attachment_url"][0],
        };
    }
}
