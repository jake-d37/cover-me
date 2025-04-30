import { ButtonHTMLAttributes, useState } from 'react'
import { useEffect } from 'react'
import Logo from './logo.tsx'
import React from 'react'

import '../styles/main.css'

function App() {
    //LATER: default these from local storage
    const [fname, setFirstName] = useState<string>("");
    const [lname, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhoneNumber] = useState<string>("");

    //LATER: default this too
    const [resume, setResume] = useState(); //PDF type when I put in the library

    const [jobLink, setJobLink] = useState<string>("");
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

    //just to check if its working
    useEffect(()=> {
        console.log(fname);
    }, [fname]);

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

    

    const findJobDescription = (e: React.MouseEvent<HTMLButtonElement>, link: string) => {
        e.stopPropagation();
        e.preventDefault();

        //check its public/legal to scrape

        //scrape
    };

    const generateCoverLetter = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        //concatenate everything

        //give to LLM

        //return result
        setCoverLetter("Whatever DeepSeek said");
    }

    const exportCoverLetter = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        //print the cover letter script to pdf using jsPDF
    }
  
    return (
        <div className='app-container'>
            <Logo/>
            
            <div className='form-body'>
                <form className=''>
                    <div className='container basic-info-container'>
                        <label className=''>
                            First Name:
                            <input 
                                type="text" 
                                name="fname"
                                placeholder='Jane'
                                value={fname}
                                onChange={(e) => setFirstName(e.target.value)}
                            >
                            </input>
                        </label>
                        <label className=''>
                            Last Name:
                            <input 
                                type="text" 
                                name="lname"
                                placeholder='Citizen'
                                value={lname}
                                onChange={(e) => setLastName(e.target.value)}
                            >
                            </input>
                        </label>
                        <label className=''>
                            Email:
                            <input 
                                type="text" 
                                name="email"
                                placeholder='janecitizen@email.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            >
                            </input>
                        </label>
                        <label className=''>
                            Phone Number:
                            <input 
                                type="text" 
                                name="phone"
                                placeholder='0400 123 456'
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
                        RESUME SELCTOR GOES HERE
                        
                    </div>
                    <div className='container job-page-tools-container'>
                        <label className='field-container'>
                            <div className='field-content'>
                                Job description link:
                            </div> 
                            <input 
                                type="text" 
                                name="joblink"
                                placeholder='Link to job page goes here...'
                                className='field-content'
                                value={jobLink}
                                onChange={(e) => setJobLink(e.target.value)}
                            >
                            </input>
                            <button
                                className='btn'
                                onClick={(e) => findJobDescription(e, jobLink)}
                            >
                                Retrieve job description
                            </button>
                        </label>
                        <label className='edit-job-text-container'>
                            Job description: 
                            <textarea 
                                name="jobdesc"
                                value={jobDesc}
                                placeholder='...or paste job description here'
                                onChange={(e) => setJobDescription(e.target.value)}
                            >
                            </textarea>
                        </label>
                    </div>
                    <div className='container writing-style-container'>
                        <h2 className=''>Writing style</h2>
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
                            placeholder='Any other requests here, in natural language'
                            onChange={(e) => setNotes(e.target.value)}
                        >
                        </input>
                    </label>
                    <input 
                        className='btn form-action-button'
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
                            onChange={(e) => setCoverLetter(e.target.value)}
                        >
                        </textarea>
                    </label>
                    <input
                        className='btn form-action-button'
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
