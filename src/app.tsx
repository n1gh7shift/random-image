import {
  Button,
  FormField,
  MultilineInput,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";

import { response } from "express";
import React, { useState } from "react";
import styles from "styles/components.css";
import { upload } from "@canva/asset";
import { addNativeElement } from "@canva/design";


const BACKEND_URL = 'https://source.unsplash.com/random/1920x1080'


type State = "idle" | "loading" | "success" | "error";

function uuidv4() { 
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'
  .replace(/[xy]/g, function (c) { 
      const r = Math.random() * 16 | 0,  
          v = c == 'x' ? r : (r & 0x3 | 0x8); 
      return v.toString(16); 
  }); 
}



type AppElementData = {
  imageUrl: string;
  width: number;
  height: number;
  rotation: number;
  uuid: string;
};



const currentImage: AppElementData = {
  imageUrl: "",
  width: 1920,
  height: 1080,
  rotation: 0,
  uuid: ""

}

async function handleClick(url) {
  // Upload an image


  const result = await upload({
    type: "IMAGE",
    id: currentImage.uuid,
    mimeType: "image/jpeg",
    url: currentImage.imageUrl,
    thumbnailUrl:
    currentImage.imageUrl,
  });

    // Add the image to the design
    await addNativeElement({
      type: "IMAGE",
      ref: result.ref,
    });
}


export const App = () => {
  const [state, setState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined
  );

  const sendGetRequest = async () => {
    try {
      setState("loading");
      const res = await fetch(BACKEND_URL);

      const body = await res; //.json();
      setResponseBody(body);
      setState("success");

      currentImage.uuid = uuidv4();
      currentImage.imageUrl = body.url;


    } catch (error) {
      setState("error");
      console.error(error);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          This retrieves a random images from Unsplash and allows you to add to your design. Just click generate until your happy and click on the image to add it.
        </Text>
        {/* Idle and loading state */}
        {state !== "error" && (
          <>
            <Button
              variant="primary"
              onClick={sendGetRequest}
              loading={state === "loading"}
              stretch
            >
              Generate
            </Button>
            {state === "success" && responseBody && (
              // console.log(responseBody.url)

              <img src={responseBody.url} onClick={() => handleClick(responseBody.url)} />
            )}
          </>
        )}

        {/* Error state */}
        {state === "error" && (
          <Rows spacing="3u">
            <Rows spacing="1u">
              <Title size="small">Something went wrong</Title>
              <Text>To see the error, check the JavaScript Console.</Text>
            </Rows>
            <Button
              variant="secondary"
              onClick={() => {
                setState("idle");
              }}
              stretch
            >
              Reset
            </Button>
          </Rows>
        )}
      </Rows>
    </div>
  );
};