"use client";
/* Release: ee65b719 (Latest – unreleased) */

import classNames from "classnames";
import * as SubframeCore from "@subframe/core";
import { Button } from "../components/subframe";
import { FileItem } from "../components/subframe";
import { Navbar } from "../components/subframe";

import { NewComponent } from "../components/subframe";
import { TextInput } from "../components/subframe";

import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { FaRobot, FaUser, FaPaperclip } from "react-icons/fa";
import WebViewer from "@pdftron/webviewer";
import { upsertFile, getBotResponse, getFilePreviews, getFile } from "../utils";
import supabase from "../lib/supabaseClient";
import { useUserStateContext } from "../context/UserStateContext";

const ChatComponent: React.FC = () => {
  const viewer = useRef<any>(null);

  const { bearer } = useUserStateContext();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [filePreviews, setFilePreviews] = useState<Array<any>>([]);
  const [fileToShow, setFileToShow] = useState("");
  const [docViewer, setDocViewer] = useState<any>(null);
  const [messages, setMessages] = useState<Array<any>>([
    {
      message: {
        answer: "Hello, how can I help you today?",
        sources: [],
      },
      isUser: false,
    },
  ]);

  const handleChange = (e: any) => {
    setInput(e.target.value);
  };

  const fetchPreviews = async () => {
    const previews = await getFilePreviews(bearer);
    if (previews !== undefined) {
      setFilePreviews(previews);
      if (previews.length > 0) {
        setFileToShow(previews[0].file_name);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setInput("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: { answer: input, sources: [] }, isUser: true },
    ]);
    setLoading(true);
    const response = await getBotResponse(input, bearer);
    if (response) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: { answer: response.answer, sources: response.sources },
          isUser: false,
        },
      ]);
    }

    setLoading(false);
  };

  const handleFileUpload = async (files: FileList | null) => {
    setFileLoading(true);
    if (files) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      // Now you can use `formData` to upload the files to a server.
      // For example, using the fetch API:
      console.log("Files ready to be uploaded: ", selectedFiles);
      await upsertFile(formData, bearer);

      await fetchPreviews();

      setFileLoading(false);

      if (fileInputRef.current) {
        console.log("resetting");
        fileInputRef.current.value = "";
      }
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

  const handleFilePreviewClick = (name: string) => {
    setFileToShow(name);
    console.log("File preview clicked: ", name);
  };

  const didSelectSource = (source: string) => {
    console.log("Source selected: ", source);
    setFileToShow(source);
  };

  useEffect(() => {
    WebViewer(
      {
        path: "/public",
        licenseKey: import.meta.env.VITE_APRYSE_API_KEY,
        // initialDoc:
        //   "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf",
      },
      viewer.current
    ).then((instance) => {
      const { documentViewer } = instance.Core;
      setDocViewer(documentViewer);
      // you can now call WebViewer APIs here...
      // documentViewer.loadDocument()
    });
  }, []);

  useEffect(() => {
    // get file previews

    if (bearer) {
      fetchPreviews();
    }
  }, [bearer]);

  useEffect(() => {
    async function loadFile() {
      if (fileToShow && docViewer) {
        const url = await getFile(fileToShow, bearer);
        docViewer.loadDocument(url);
      }
    }
    loadFile();
  }, [fileToShow, docViewer]);

  return (
    <div className="flex flex-col  items-start w-full h-screen group/cb0e46cf">
      <Navbar className="shrink-0">
        <Navbar.Item onClick={() => supabase.auth.signOut()}>
          Log out
        </Navbar.Item>
      </Navbar>
      <div className="min-h-0 flex bg-default-background grow shrink basis-0 w-full items-start">
        <div className="flex border-r border-solid border-neutral-border pt-6 pr-6 pb-6 pl-6 h-full flex-col gap-4 items-start">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
          ></input>
          <Button
            loading={fileLoading}
            className="flex-none h-10 w-full"
            icon="FeatherFile"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload PDF
          </Button>
          <div className="flex bg-neutral-300 flex-none h-px w-full flex-col gap-2 items-center" />
          <div className="flex flex-col gap-6 items-start overflow-y-auto">
            {filePreviews.map((filePreview) => {
              console.log(filePreview);
              return (
                <FileItem
                  key={filePreview.file_name}
                  selected={filePreview.file_name == fileToShow}
                  name={filePreview.file_name}
                  onClick={() => handleFilePreviewClick(filePreview.file_name)}
                  imagePreview={
                    <img
                      className="flex-none h-32 w-32"
                      src={`data:image/jpeg;base64,${filePreview.file_preview_img}`}
                    />
                  }
                />
              );
            })}
            {/* <FileItem />
            <FileItem selected={true} name="claim_2\n.pdf" />
            <FileItem selected={false} name="claim_3.pdf" />
            <FileItem selected={false} name="claim_4.pdf" />
            <FileItem /> */}
          </div>
        </div>
        <div className="flex flex-col bg-neutral-50 pt-4 gap-4 items-start justify-center grow shrink-0 basis-0 w-full h-full overflow-y-auto">
          <div className="flex flex-col  pr-4 pb-4 pl-4 flex-grow gap-2 items-start w-full h-full">
            {/* <div className="flex bg-brand-50 border border-solid border-brand-300 rounded pt-1 pr-4 pb-1 pl-4 gap-2 items-center w-full">
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
            </div> */}
            <div className="w-full flex-grow" ref={viewer}></div>
          </div>
        </div>

        <div className="flex border-l border-solid border-neutral-border pt-4 pr-4 pb-4 pl-4 flex-col gap-4 items-start h-full">
          <div className="overflow-y-auto flex-grow">
            <NewComponent
              messages={messages}
              didSelectSource={didSelectSource}
              loading={loading}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 items-center w-full mb-4"
          >
            <div className="flex-grow">
              <TextInput
                className="grow shrink-0 basis-0 w-full h-auto"
                label=""
              >
                <TextInput.Input
                  value={input}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full"
                  placeholder="Type your message"
                />
              </TextInput>
            </div>

            <Button
              size="Small"
              rightIcon="FeatherSend"
              type="submit"
              disabled={loading}
              loading={loading}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
