import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { spawn } from 'child_process';
import {configureOpenAI} from "../config/openai-config.js"
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    // grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    //console.log(chats)
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });
    await user.save();
    const pythonProcess = spawn('python', ['../pythonf.py', message]);
    // Listen for output from the Python script
    var outputData
    pythonProcess.stdout.on('data', (data) => {
        outputData = data.toString().trim();
        //res.send({ output: outputData });
        user.chats.push({role:"assistant",content:outputData})
    
    });
    console.log("Hello",outputData)
    // send all chats with new one to openAI API
    const config = configureOpenAI();
    const openai = new OpenAIApi(config);
    // get latest response
    // const chatResponse = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: chats,
    // });
    //user.chats.push(chatResponse.data.choices[0].message);
    //user.chats.push({role:"assistant",content:"Welcome"})
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }
      return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };
  
  export const deleteChats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }
      //@ts-ignore
      user.chats = [];
      await user.save();
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  };