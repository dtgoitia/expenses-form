import { SyntheticEvent } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";

interface TagProps {
  name: string;
  picked: boolean;
  onClick: () => void;
}

function TagComponent({ name, picked, onClick }: TagProps) {
  const customOnClick = (e: SyntheticEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <Button size="mini" primary={picked} onClick={customOnClick}>
      {name}
    </Button>
  );
}

const StyledTagContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: flex-start;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
`;

export type TagName = string;
export interface Tag {
  name: TagName;
  picked: boolean;
}
interface TagSelectorProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
}

function TagSelector({ tags, onChange }: TagSelectorProps) {
  const switchTagPickState = (name: TagName) => {
    const updatedPickedTags = tags.map((tag: Tag) => {
      if (tag.name === name) {
        const updatedTag: Tag = { ...tag, picked: !tag.picked };
        return updatedTag;
      }

      return tag;
    });

    onChange(updatedPickedTags);
  };

  return (
    <StyledTagContainer>
      {tags.map((tag: Tag, i: number) => (
        <TagComponent
          key={`${tag.name}-${i}`}
          name={tag.name}
          picked={tag.picked}
          onClick={() => switchTagPickState(tag.name)}
        ></TagComponent>
      ))}
    </StyledTagContainer>
  );
}

const StyledTagSelector = styled(TagSelector)``;

export default StyledTagSelector;
