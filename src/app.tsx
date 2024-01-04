import {
  Button,
  FormField,
  LoadingIndicator,
  MultilineInput,
  Rows,
  Text,
  Title,
} from "@canva/app-ui-kit";

import React, { useState } from "react";
import styles from "styles/components.css";
import { upload } from "@canva/asset";
import { addNativeElement } from "@canva/design";
import { relative } from "path";

const BACKEND_URL = "https://source.unsplash.com/random/1920x1080";

type State = "idle" | "loading" | "success" | "error";

function uuidv4() {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
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
  uuid: "",
};

export const App = () => {
  const [state, setState] = useState<State>("idle");
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined
  );
  const [imageAdding, setImageAdding] = useState(false);

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

  async function handleClick(url) {
    setImageAdding(true);

    // Upload an image

    const result = await upload({
      type: "IMAGE",
      id: currentImage.uuid,
      mimeType: "image/jpeg",
      url: currentImage.imageUrl,
      thumbnailUrl: currentImage.imageUrl,
    });

    // Add the image to the design
    await addNativeElement({
      type: "IMAGE",
      ref: result.ref,
    });

    setImageAdding(false);
  }

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <Text>
          Click on 'Get random image' to pull randomized Unsplash photos. Browse
          until you find the one that fits your project, then click on the image
          or 'Add to design' button to add it to your design.
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
              Get random image
            </Button>
            {state === "success" && responseBody && (
              // console.log(responseBody.url)

              <Rows spacing="1u">
                <div style={{ position: "relative", width: "100%" }}>
                  <img
                    src={responseBody.url}
                    onClick={() => handleClick(responseBody.url)}
                    style={{ cursor: "pointer", width: "100%" }}
                  />

                  {imageAdding ? (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "hsl(0,0%,0%,0.6)",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LoadingIndicator />
                    </div>
                  ) : null}
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleClick(responseBody.url)}
                  disabled={imageAdding}
                >
                  Add to design
                </Button>
              </Rows>
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
