import { useState } from 'react';

export interface PromptDetails {
    name: string,
    email: string,
    phoneNumber: string,
    resume: string,
    writingStyle: string,
    jobDesc: string,
    tones: Set<string>,
    notes: string
}

export default async function generatePrompt(details: PromptDetails): Promise<string>{
    let prompt: string = "";

    //get raw prompt
    try {
        // Fetch the text file from the public folder
        const response = await fetch('/prompt.txt');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Read the response as text
        prompt = await response.text();
    } catch (error) {
        console.error('Error fetching the text file:', error);
    }

    //replace variable placeholders in prompt
    let customPrompt = prompt;
    customPrompt = handleReplace(customPrompt, "{name}", details.name);
    customPrompt = handleReplace(customPrompt, "{email}", details.email);
    customPrompt = handleReplace(customPrompt, "{phoneNumber}", details.phoneNumber);
    customPrompt = handleReplace(customPrompt, "{resumeString}", details.resume);
    customPrompt = handleReplace(customPrompt, "{writingStyleString}", details.writingStyle);
    customPrompt = handleReplace(customPrompt, "{jobDescription}", details.jobDesc);

    //tones are a little different, need to concat them all
    let tonesString = "";
    for (const tone of details.tones) {
        tonesString = tonesString.concat(`, ${tone}`);
    }

    //trim leading comma
    tonesString = tonesString.startsWith(", ") ? tonesString.slice(2) : tonesString;

    //add tones in now
    customPrompt = handleReplace(customPrompt, "{toneArray}", tonesString);

    console.log(customPrompt);

    return customPrompt;
}

function handleReplace(textContent:string, subsetName: string, replaceWith: string): string{
    //create dynamic regular expression for the subsetName
    const regex = new RegExp(subsetName, 'g'); // 'g' is for global replacement (replace all occurrences)
    
    //replace all occurrences of subsetName with replaceWith
    let ans = textContent.replace(regex, replaceWith);

    return ans;
}