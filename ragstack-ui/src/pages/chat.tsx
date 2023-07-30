"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import { Button } from "../components/subframe";
import { FileItem } from "../components/subframe";
import { NewComponent } from "../components/subframe";
import { TextInput } from "../components/subframe";

import React, { ChangeEvent, useState, useRef, useEffect } from 'react'
import { FaRobot, FaUser, FaPaperclip } from "react-icons/fa";

import { upsertFile, getBotResponse } from '../utils';

// const ChatComponent: React.FC = () => {
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fileLoading, setFileLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
//   const [messages, setMessages] = useState<Array<MessageProps>>([
//     {
//       message: {
//         answer: "Hello, how can I help you today?",
//         sources: [],
//       },
//       isUser: false,
//     },
//   ]);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleChange = (e: any) => {
//     setInput(e.target.value);
//   };    

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     console.log("Message sent:", input);
//     setInput("");
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { message: { answer: input, sources: [] }, isUser: true },
//     ]);
//     setLoading(true);
//     const answer = await getBotResponse(input);
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { message: { answer: answer, sources: [] }, isUser: false },
//     ]);
//     setLoading(false);
//   };

//   const handleFileUpload = async (files: FileList | null) => {
//     console.log(files)
//     setFileLoading(true);
//     if (files) {
//       const formData = new FormData();
//       for (let i = 0; i < files.length; i++) {
//         formData.append('files', files[i]);
//       }

//       // Now you can use `formData` to upload the files to a server.
//       // For example, using the fetch API:
//       console.log("Files ready to be uploaded: ", selectedFiles);
//       await upsertFile(formData);
//       setFileLoading(false);
//     } else {
//       console.log("No files selected");
//       setFileLoading(false);
//     }

//   };

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     setSelectedFiles(files);
//     handleFileUpload(files);
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   return (
//     <>
//       <div className="h-[500px] w-full bg-gray-200 overflow-y-auto text-gray-900">
//         {messages.map((message, index) => (
//           <Message
//             key={index}
//             message={message.message}
//             isUser={message.isUser}
//           />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300">
//         <div className="flex items-center">
//           <label>
//             <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange}></input>
//             <Button className="mr-2" gradientDuoTone="purpleToBlue" onClick={() => fileInputRef.current?.click()}>
//               {fileLoading ? <Spinner size="sm" /> : <FaPaperclip size="1.2em" className="p-0" />}
//             </Button>
//           </label>
//           <TextInput
//             type="text"
//             value={input}
//             onChange={handleChange}
//             disabled={loading}
//             className="flex-grow"
//             placeholder="Type your message"
//           />
//           <Button
//             type="submit"
//             disabled={loading}
//             className="ml-4 w-36"
//             gradientDuoTone="purpleToPink"
//           >
//             {loading ? <Spinner size="sm" /> : <div>Send</div>}
//           </Button>
//         </div>
//       </form>
//     </>
//   )
// }
// interface MessageProps {
//   message: any;
//   isUser: boolean;
// }

// const Message: React.FC<MessageProps> = ({ message, isUser }) => (
//   <div
//     className={`flex items-center px-2 py-8 min-h-50  ${
//       isUser ? "bg-white" : "bg-gray-200"
//     }`}
//   >
//     <div className={`flex items-center justify-center h-10 w-10 mx-4`}>
//       {isUser ? <FaUser size="1.5em" /> : <FaRobot size="1.5em" />}
//     </div>
//     <div className="mx-4">
//       <div>{message.answer}</div>
//       <div> </div>
//       {message.sources.map((source: any, index: any) => (
//         <div className=" flex">
//           <p className="mr-2">{index + 1}.</p>
//           <a
//             target="_blank"
//             className="underline text-blue-500"
//             href={source.url}
//           >
//             {source.title}
//           </a>
//         </div>
//       ))}
//     </div>
//   </div>
// );

const ChatComponent: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 items-start w-full h-full group/cb0e46cf">
      <div className="flex bg-default-background grow shrink-0 basis-0 h-full w-full items-start">
        <div className="flex border-r border-solid border-neutral-border pt-6 pr-6 pb-6 pl-6 h-full flex-col gap-4 items-start overflow-y-auto">
          <Button className="flex-none h-10 w-full" icon="FeatherFile">
            Upload PDF
          </Button>
          <div className="flex bg-neutral-300 flex-none h-px w-full flex-col gap-2 items-center" />
          <div className="flex flex-col gap-6 items-start">
            <FileItem />
            <FileItem selected={true} name="claim_2\n.pdf" />
            <FileItem selected={false} name="claim_3.pdf" />
            <FileItem selected={false} name="claim_4.pdf" />
            <FileItem />
          </div>
        </div>
        <div className="flex bg-neutral-50 pt-12 gap-4 items-start justify-center grow shrink-0 basis-0 w-full h-full overflow-y-auto">
          <div className="flex pt-4 pr-4 pb-4 pl-4 flex-col gap-2 items-start">
            <div className="flex bg-brand-50 border border-solid border-brand-300 rounded pt-1 pr-4 pb-1 pl-4 gap-2 items-center w-full">
              <span className="grow shrink-0 basis-0 w-full text-body font-body text-default-font">
                Are you an insurance agent?
              </span>
              <Button
                variant="Neutral Tertiary"
                size="Small"
                rightIcon="FeatherChevronRight"
              >
                Learn more
              </Button>
            </div>
            <img
              className="flex-none h-192"
              src="https://res.cloudinary.com/demo/image/upload/v1690587883/Screenshot_2023-07-28_at_4.44.27_PM_c4dmit.png"
            />
          </div>
        </div>
        <div className="flex border-l border-solid border-neutral-border pt-4 pr-4 pb-4 pl-4 flex-col gap-4 items-start h-full overflow-y-auto">
          <NewComponent />
          <div className="flex gap-2 items-center w-full">
            <TextInput
              className="grow shrink-0 basis-0 w-full h-auto"
              label=""
            />
            <Button size="Small" rightIcon="FeatherSend">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatComponent
