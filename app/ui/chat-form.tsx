"use client";

import { fetchPersonas, fetchModels, fetchOutputFormats } from "../lib/api";
import {
  Persona,
  Model,
  OutputFormat,
  FormProps,
  ChatResponse,
  Chat,
} from "../lib/model";
import SelectBox from "./select-box";
import { createChat } from "../lib/actions";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Spinner, SpinnerSize } from "./spinner";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function ChatForm({
  updateMessage,
  updateShowSpinner,
  responseHistory,
  resetChat,
  currentChat,
}: FormProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [promptVal, setPromptVal] = useState("");
  const [data, setData] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [outputFormats, setOutputFormats] = useState<OutputFormat[]>([]);
  //const [responseHistory, setResponseHistory] = useState<ChatResponse[]>([]);
  const router = useRouter();
  const disableSelection = responseHistory.length > 0;
  const [defaultModel, setDefaultModel] = useState("gpt-4");

  const handleReset = (e: React.MouseEvent) => {
    resetPage();
  };

  const resetPage = () => {
    resetChat();
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
    //setResponseHistory([]);
    router.refresh();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personasData = await fetchPersonas();
        setPersonas(personasData);
        const modelsData = await fetchModels();
        setModels(modelsData);
        const outputFormatsData = await fetchOutputFormats();
        setOutputFormats(outputFormatsData);
      } catch (error) {
        console.error("Error fetching initialization data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentChat) {
      console.log("The chat has changed so I should update the select fields");
      setDefaultModel(currentChat.model);
    }
  }, [currentChat]);

  useEffect(() => {
    console.log("Using effect");
    const fetchData = async () => {
      if (data) {
        try {
          console.log("message received. Updating.");
          updateShowSpinner(true);
          const chat = await createChat(data, responseHistory);
          updateMessage(chat);
          console.log("Done updating");
          updateShowSpinner(false);
          if (textAreaRef.current) {
            textAreaRef.current.value = "";
          }
          setIsSubmitting(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          updateShowSpinner(false);
          setIsSubmitting(false);
          alert("Error retrieving data");
          throw error;
        }
      }
    };
    if (isSubmitting === true) {
      console.log("submitting form data");
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  //Adjust the height of the prompt box as needed
  useEffect(() => {
    //Min/Max height of the Text box
    const minTextAreaHeight = 76;
    const maxTextAreaHeight = 300;

    const textArea = textAreaRef.current;
    if (!textArea) return;

    // Reset height to its initial or auto state to properly calculate scroll height.
    textArea.style.height = "auto";

    // Calculate the required height, and ensure it's within the defined min and max range.
    const requiredHeight = textArea.scrollHeight;
    const newHeight = Math.min(
      Math.max(requiredHeight, minTextAreaHeight),
      maxTextAreaHeight
    );

    // Apply the newHeight to the text area's height style.
    textArea.style.height = `${newHeight}px`;
  }, [promptVal]);

  const handleSubmit = (formData: FormData) => {
    setData(formData);
    setIsSubmitting(true);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptVal(e.target.value);
  };

  return (
    <form action={handleSubmit}>
      <div className="m-3">
        <label className="text-gray-700 text-xs" htmlFor="model">
          Model
        </label>
        <SelectBox
          name="model"
          disableSelection={disableSelection}
          defaultValue={currentChat?.model ?? ""}
        >
          {models.map((model: Model) => {
            return (
              <option value={model.name} key={model.name}>
                {model.title}
              </option>
            );
          })}
        </SelectBox>
      </div>
      <div className="m-3">
        <label className="text-gray-700 text-xs" htmlFor="persona">
          Persona
        </label>
        <SelectBox
          name="persona"
          disableSelection={disableSelection}
          defaultValue={currentChat?.persona ?? 0}
        >
          {personas.map((persona: Persona) => {
            return (
              <option value={persona.id} key={persona.id}>
                {persona.name}
              </option>
            );
          })}
        </SelectBox>
      </div>
      <div className="m-3">
        <label className="text-gray-700 text-xs" htmlFor="outputFormat">
          Output Format
        </label>
        <SelectBox
          name="outputFormat"
          disableSelection={disableSelection}
          defaultValue={currentChat?.outputFormat ?? 0}
        >
          {outputFormats.map((outputFormat: OutputFormat) => {
            return (
              <option value={outputFormat.id} key={outputFormat.id}>
                {outputFormat.name}
              </option>
            );
          })}
        </SelectBox>
      </div>
      <div className="m-3">
        <label className="text-gray-700 text-xs" htmlFor="prompt">
          Enter your prompt:
        </label>
        <div className="overflow-hidden [&:has(textarea:focus)]:border-token-border-xheavy [&:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-token-border-heavy flex-grow relative border border-token-border-heavy dark:text-white rounded-2xl bg-white dark:bg-gray-800 shadow-[0_0_0_2px_rgba(255,255,255,0.95)] dark:shadow-[0_0_0_2px_rgba(52,53,65,0.95)]">
          <textarea
            className="m-0 text-sm w-full resize-none border-0 bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4"
            id="prompt"
            name="prompt"
            ref={textAreaRef}
            onChange={handleTextAreaChange}
          ></textarea>
        </div>
      </div>
      <div className="m-3">
        <button
          className="rounded-md text-sm bg-slate-300 p-2 hover:bg-slate-400 mr-3"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <div className="flex flex-row">
              <div className="align-baseline self-baseline justify-end">
                <Spinner spinnerSize={SpinnerSize.sm} />
              </div>
              <div>Processing</div>
            </div>
          ) : (
            "Submit"
          )}
        </button>
        <button
          className="rounded-md text-sm bg-slate-200 p-2 hover:bg-slate-300"
          type="reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </form>
  );
}