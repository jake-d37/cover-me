import { useState } from "react"

export default function Loader(msg: string = "Loading"){
    const [message, setMessage] = useState<string>(msg);

    return (
        <div className="loader-container">
            <h1>
                {message}
            </h1>
            {/* loader animation goes here*/}
        </div>
    )
}