const singleTripTagPattern = new RegExp(/(#[0-9]{4}[a-z]+)/gm);

function getTripTag(description: string): string | undefined {
  const tripTagMatch = singleTripTagPattern.exec(description);
  if (tripTagMatch === null) {
    return undefined;
  }

  const tripTag = tripTagMatch[0];
  return tripTag;
}

type DescriptionWithoutTags = string;

function stripAllTags(description: string): string {
  const chars: string[] = [];

  for (const char of description) {
    if (char === "#") {
      break;
    }

    chars.push(char);
  }

  // Remove last empty space
  const lastChar = chars.pop();
  if (lastChar && lastChar !== " ") {
    chars.push(lastChar);
  }

  const textBeforeFirstHash = chars.join("");

  return textBeforeFirstHash;
}

function getWhat(description: DescriptionWithoutTags): string {
  const [what] = description.split(" with @");
  return what;
}
function getSeller(description: DescriptionWithoutTags): string {
  const [, seller] = description.split(" at @");
  return seller;
}

export function descriptionToSplitwiseFormat(description: string): string {
  const tripTag = getTripTag(description);

  const withoutTags = stripAllTags(description);

  const what = getWhat(withoutTags);
  const seller = getSeller(withoutTags);

  let splitwiseDescription = `${what} @ ${seller}`;
  if (tripTag) {
    splitwiseDescription = `${splitwiseDescription} ${tripTag}`;
  }
  return splitwiseDescription;
}
