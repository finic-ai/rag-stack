import React, { ChangeEvent, useState, useRef, useEffect } from 'react'
import { Button, TextInput, Spinner } from 'flowbite-react'
import { FaRobot, FaUser, FaPaperclip } from "react-icons/fa";

import { upsertFile, getBotResponse } from '../utils';

const ChatComponent: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [messages, setMessages] = useState<Array<MessageProps>>([
    {
      message: {
        answer: "Hello, how can I help you today?",
        sources: [],
      },
      isUser: false,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };    

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Message sent:", input);
    setInput("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: { answer: input, sources: [] }, isUser: true },
    ]);
    setLoading(true);
    const answer = await getBotResponse(input);
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: { answer: answer, sources: [] }, isUser: false },
    ]);
    setLoading(false);
  };

  const handleFileUpload = async (files: FileList | null) => {
    console.log(files)
    setFileLoading(true);
    if (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // Now you can use `formData` to upload the files to a server.
      // For example, using the fetch API:
      console.log("Files ready to be uploaded: ", selectedFiles);
      await upsertFile(formData);
      setFileLoading(false);
    } else {
      console.log("No files selected");
      setFileLoading(false);
    }

  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
    handleFileUpload(files);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="h-[500px] w-full bg-gray-200 overflow-y-auto text-gray-900">
        {messages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            isUser={message.isUser}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300">
        <div className="flex items-center">
          <label>
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange}></input>
            <Button className="mr-2" gradientDuoTone="purpleToBlue" onClick={() => fileInputRef.current?.click()}>
              {fileLoading ? <Spinner size="sm" /> : <FaPaperclip size="1.2em" className="p-0" />}
            </Button>
          </label>
          <TextInput
            type="text"
            value={input}
            onChange={handleChange}
            disabled={loading}
            className="flex-grow"
            placeholder="Type your message"
          />
          <Button
            type="submit"
            disabled={loading}
            className="ml-4 w-36"
            gradientDuoTone="purpleToPink"
          >
            {loading ? <Spinner size="sm" /> : <div>Send</div>}
          </Button>
        </div>
      </form>
    </>
  )
}
interface MessageProps {
  message: any;
  isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isUser }) => (
  <div
    className={`flex items-center px-2 py-8 min-h-50  ${
      isUser ? "bg-white" : "bg-gray-200"
    }`}
  >
    <div className={`flex items-center justify-center h-10 w-10 mx-4`}>
      {isUser ? <FaUser size="1.5em" /> : <FaRobot size="1.5em" />}
    </div>
    <div className="mx-4">
      <div>{message.answer}</div>
      <div> </div>
      {message.sources.map((source: any, index: any) => (
        <div className=" flex">
          <p className="mr-2">{index + 1}.</p>
          <a
            target="_blank"
            className="underline text-blue-500"
            href={source.url}
          >
            {source.title}
          </a>
        </div>
      ))}
    </div>
  </div>
);

export default ChatComponent
