import { TagName } from "../../domain";
import { SyntheticEvent } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";

interface TagProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

function TagComponent({ name, selected, onClick }: TagProps) {
  const customOnClick = (e: SyntheticEvent) => {
    e.preventDefault();
    onClick();
  };

  return (
    <Button size="mini" primary={selected} onClick={customOnClick}>
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

export interface SelectableTag {
  name: TagName;
  selected: boolean;
}

interface TagSelectorProps {
  tags: SelectableTag[];
  onChange: (tags: SelectableTag[]) => void;
}

function TagSelector({ tags, onChange }: TagSelectorProps) {
  function toggleTag(name: TagName) {
    const updatedTags = tags.map((tag) => {
      if (tag.name !== name) return tag;

      const toggledTag: SelectableTag = { ...tag, selected: !tag.selected };
      return toggledTag;
    });

    onChange(updatedTags);
  }

  return (
    <StyledTagContainer>
      {tags.map((tag, i) => (
        <TagComponent
          key={`${tag.name}-${i}`}
          name={tag.name}
          selected={tag.selected}
          onClick={() => toggleTag(tag.name)}
        />
      ))}
    </StyledTagContainer>
  );
}

export default TagSelector;
