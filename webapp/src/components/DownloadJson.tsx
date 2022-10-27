import { Expense } from "../domain/model";
import { postExpensesToLaptop } from "../domain/transferToLaptop";
import storage from "../localStorage";
import { Button } from "@blueprintjs/core";
import { useState } from "react";
import styled from "styled-components";

function buildJson(expenses: Expense[]): Blob {
  const jsonString = JSON.stringify(expenses, null, 2);

  const json = new Blob([jsonString], { type: "application/json" });
  return json;
}

const Container = styled.div`
  padding: 1rem 0;
`;

function downloadJson(blob: Blob, filename: string): void {
  const fileUrl = URL.createObjectURL(blob);
  const xhr = new XMLHttpRequest();
  xhr.open("GET", fileUrl, true);
  xhr.responseType = "blob";
  xhr.onload = function (e) {
    if (this.status === 200) {
      const responseWithDesiredBlob = this.response;
      const anchor = document.createElement("a");
      anchor.href = window.URL.createObjectURL(responseWithDesiredBlob);
      anchor.download = filename;
      anchor.click();
    } else {
      const error = [
        `Status 200 expected but got ${this.status} instead. No idea what happened`,
        `here:\n`,
        `\n`,
        `blob=${blob.text()}\n`,
        `\n`,
        `filename=${filename}\n`,
        `\n`,
        `fileUrl=${fileUrl}\n`,
        `\n`,
      ].join("");
      throw new Error(error);
    }
  };
  xhr.send();
}

function shareApiNotAvailable(): boolean {
  return navigator.share === undefined;
}

function getTimestamp(): string {
  return new Date()
    .toISOString()
    .slice(0, 19)
    .replaceAll(":", "")
    .replaceAll("-", "")
    .replace("T", "-");
}

interface DownloadJsonProps {
  expenses: Expense[];
}
function DownloadJson({ expenses }: DownloadJsonProps) {
  const [pushing, setPushing] = useState(false);

  const timestamp = getTimestamp();
  const fileName = `expenses-form-${timestamp}.json`;
  const shareApiAvailable = shareApiNotAvailable() === false;

  function download(): void {
    const blob = buildJson(expenses);
    downloadJson(blob, fileName);
  }

  function share(): void {
    const blob = buildJson(expenses);
    const file = new File([blob], fileName, { type: "text/csv" });
    if (shareApiNotAvailable()) {
      alert("Your device is not compatible with the Web Share API, sorry :)");
      return;
    }

    const dataToShare: ShareData = {
      title: "fitness-tracker CSV",
      files: [file],
    };

    const canShare = navigator.canShare(dataToShare);
    if (!canShare) {
      alert("You cannot share the CSV for some reason, sorry :)");
      return;
    }

    navigator
      .share(dataToShare)
      .then(() => alert("all good"))
      .catch((error) => {
        alert(error);
      });
  }

  function pushToServer() {
    const url = storage.peerHostname.read();
    if (url === undefined) {
      alert(`Please, set up peer hostname in settings`);
      return;
    }
    setPushing(true);
    postExpensesToLaptop({ url, expenses }).then(({ success }) => {
      console.log(success);
      setPushing(false);
      if (success === false) {
        alert("Something went wrong");
      }
    });
  }

  return (
    <Container>
      <Button intent="success" text="Download CSV" onClick={() => download()} />
      <Button
        intent="success"
        text="Share CSV"
        onClick={() => share()}
        disabled={shareApiAvailable === false}
      />
      <Button
        intent="success"
        text="Push JSON to server"
        onClick={() => pushToServer()}
        disabled={pushing}
        icon={pushing ? "refresh" : "airplane"}
      />
    </Container>
  );
}

export default DownloadJson;
