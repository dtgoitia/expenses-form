import { stringToDescription } from "./components/Description";
import { TagName } from "./domain/model";

const SINGLE_TRIP_TAG_PATTERN = new RegExp(/([0-9]{4}[a-z]+)/gm);

function isTripTag(tag: TagName): boolean {
  const tripTagMatch = SINGLE_TRIP_TAG_PATTERN.exec(tag);
  return tripTagMatch !== null;
}

export function descriptionToSplitwiseFormat(raw: string): string {
  const description = stringToDescription({ raw });

  const tripTags = description.tags
    .filter(isTripTag)
    .map((tag) => `#${tag}`)
    .join(" ");

  let splitwiseDescription = `${description.main?.trim()} @ ${description.seller}`;
  if (tripTags) {
    splitwiseDescription = `${splitwiseDescription} ${tripTags}`;
  }
  return splitwiseDescription;
}
