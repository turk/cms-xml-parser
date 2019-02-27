import fs from "fs";
import inquirer from "inquirer";
import config from "./config/config";
import { ParserFactory } from "./parser/ParserFactory";

// process.exit();
async function start() {

  const testFolder = config.files.xmlPath;
  let cmsType = null;
  let xmlFile = null;
  const xmlFiles = [];

  fs.readdirSync(testFolder).forEach((file) => {
    xmlFiles.push(file);
  });

  const cmsQuestions = [{
    choices: ["wordpress"],
    message: "What's your CMS? (ex: wordpress)",
    name: "cms",
    type: "rawlist",
  }];

  await inquirer.prompt(cmsQuestions).then((answers: { cms: any; }) => {
    cmsType = answers.cms;
  });

  const fileQuestions = [{
    choices: xmlFiles,
    message: "Which xml do you want to parse?",
    name: "file",
    type: "rawlist",
  }];

  await inquirer.prompt(fileQuestions).then((answers: { file: any; }) => {
    xmlFile = answers.file;
  });

  const factory = await new ParserFactory();
  const parser = await factory.createParser(cmsType);
  await parser.start(xmlFile);
  console.log(parser.items);
}

start();
