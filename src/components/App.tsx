import { ButtonHTMLAttributes, useState } from 'react'
import { useEffect } from 'react'
import Logo from './logo.tsx'
import React from 'react'
import PdfParser from './pdf-parser.tsx'
import generatePrompt, { PromptDetails } from './generate-prompt.tsx'
import { getStringFromPdf } from './pdf-parser.tsx'

import '../styles/main.css'

function App() {

    //CONSIDER CACHING A PROMPT WITH RESUMES, BASIC INFO, WRITING STYLE FOR CHEAPER AI CALLS
    //LATER: default these from local storage
    const [lname, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhoneNumber] = useState<string>("");

    //LATER: default this too
    const [resume, setResume] = useState<File|undefined>(undefined);
    const [writingStyle, setWritingStyle] = useState<File|undefined>(undefined);
    const fileCharLimit:number = 750;

    const [jobDesc, setJobDescription] = useState<string>("");

    const toneOptions: readonly string[] = [
        "Professional",
        "Enthusiastic",
        "Analytical",
        "Creative",
        "Collaborative",
        "Leadership-oriented",
        "Mission-driven",
        "Adaptable",
        "Customer-focused",
        "Technical",
        "Strategic",
        "Transitional",
        "Growth-oriented",
        "Industry-savvy",
        "Global-minded"
      ];;

    //LATER: default this too
    const [tonesSelected, setToneSelected] = useState<Set<string>>(new Set());

    const [notes, setNotes] = useState<string>("");

    const [coverLetterContent, setCoverLetter] = useState<string>("");

    const handleFileResume = (file: File|undefined) => {
        setResume(file);
        console.log(file);
    }

    const handleFileWritingStyle = (file: File|undefined) => {
        setWritingStyle(file);
        console.log(file);
    }

    const handleLocalStorage = (file: File|undefined) => {
        //placeholder
    }

    const handleToneSelection = (tone: string) => {
        setToneSelected(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tone)) {
              newSet.delete(tone);
            } else {
              newSet.add(tone);
            }
            console.log("Tones selected: ", newSet);
            return newSet;
        });
    };

    const generateCoverLetter = async (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();

        //parse resume and writing styles files
        const resumeString = await getStringFromPdf(resume, undefined);
        const writingStyleString = await getStringFromPdf(writingStyle, fileCharLimit);
        
        //set up details for prompt generator
        const details: PromptDetails = {
            name: lname,
            email: email,
            phoneNumber: phone,
            resume: resumeString,
            writingStyle: writingStyleString,
            jobDesc: jobDesc,
            tones: tonesSelected,
            notes: notes
        }

        //generate prompt
        const prompt = await generatePrompt(details);

        //send prompt to LLM for response

        //return result
        setCoverLetter(prompt); //CHANGE THIS TO THE RESPONSE FROM THE LLM LATER
    }

    const exportCoverLetter = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        //print the cover letter script to pdf using jsPDF
    }
  
    return (
        <div className='app-container'>
            
            
            <div className='form-body'>
                <form className=''>
                    <div className='container basic-info-container'>
                        <label className='field-container'>
                            <div className='field-content'>Name:</div>
                            <input 
                                type="text" 
                                name="name"
                                placeholder='Jane Citizen'
                                size={50}
                                value={lname}
                                onChange={(e) => setName(e.target.value)}
                            >
                            </input>
                        </label>
                        <label className='field-container'>
                            <div className='field-content'>Email:</div>
                            <input 
                                type="text" 
                                name="email"
                                placeholder='janecitizen@email.com'
                                size={50}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            >
                            </input>
                        </label>
                        <label className='field-container'>
                            <div className='field-content'>Phone Number:</div>
                            <input 
                                type="text" 
                                name="phone"
                                placeholder='0400 123 456'
                                size={50}
                                value={phone}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only digits
                                    if (/^\d*$/.test(value)) {
                                        setPhoneNumber(value);
                                    }
                                }}
                            >
                            </input>
                        </label>
                    </div>
                    <div className='container resume-selection-container'>
                        <div>Choose a resume to tailor your cover letter to</div>
                        <PdfParser 
                            handleFile={handleFileResume} 
                            limit={undefined}
                            handleLocalStorage={handleLocalStorage}
                        ></PdfParser>
                    </div>
                    <div className='container resume-selection-container'>
                        <div>Choose a sample of your writing for the cover letter to replicate</div>
                        <PdfParser 
                            handleFile={handleFileWritingStyle}
                            limit={fileCharLimit}
                            handleLocalStorage={handleLocalStorage}
                        ></PdfParser>
                    </div>
                    <div className='container job-page-tools-container'>
                        <label className='edit-job-text-container'>
                            Job description: 
                            <textarea 
                                name="jobdesc"
                                value={jobDesc}
                                placeholder='Paste job description here.'
                                rows={15}
                                onChange={(e) => setJobDescription(e.target.value)}
                            >
                            </textarea>
                        </label>
                    </div>
                    <div className='container writing-style-container'>
                        <h2 className='writing-style-header'>Writing style</h2>
                        {toneOptions.map(option => (
                            <label key={option} className=''>
                                <input 
                                    type='checkbox'
                                    checked={tonesSelected.has(option)}
                                    value={option}
                                    onChange={() => handleToneSelection(option)}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                    <label className='container added-notes-container'>
                        Added notes:
                        <input
                            type="text"
                            name="notes"
                            value={notes}
                            placeholder='Note any other requests here in natural language'
                            onChange={(e) => setNotes(e.target.value)}
                        >
                        </input>
                    </label>
                    <input 
                        className='btn form-action'
                        type="submit" 
                        value="Generate cover letter" 
                        onClick={(e) => generateCoverLetter(e)}
                    />
                </form> 
                <form className='form-body'>
                    <label className='container edit-cover-letter-container'>
                        Edit cover letter result. We recommend removing em dashes--these, for example.
                        <textarea
                            className=''
                            name="cover-letter-contenets"
                            value={coverLetterContent}
                            rows={15}
                            onChange={(e) => setCoverLetter(e.target.value)}
                        >
                        </textarea>
                    </label>
                    <input
                        className='btn form-action'
                        type="submit"
                        value="Export as PDF"
                        onClick={(e)=>exportCoverLetter(e)}
                    ></input>
                </form>
            </div>
        </div>
    )
}

export default App
