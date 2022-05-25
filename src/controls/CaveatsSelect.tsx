import Select, { GroupBase, MultiValue } from 'react-select';

type OptionType = {
    value: string;
    label: string;
  };

const caveats = [
    "Flood Prone",
    "River Crossings",
    "Glacier Travel",
    "Snow Skills Required",
    "Scrambling",
    "Exposed",
    "Family Friendly"
]

const caveatOptions = caveats.map<OptionType>( (caveat) => { return {value: caveat, label: caveat} })

interface ICaveatsSelectProps {
    value: string
    handleValueChanged: (caveats: string) => void
}

export const CaveatsSelect = (props: ICaveatsSelectProps) => {
  const selected = props.value.split(',').map(c => caveatOptions.find(o => o.label == c))

  const handleChange = (option: MultiValue<OptionType|undefined>) => {
    props.handleValueChanged(option.filter((o): o is OptionType => !!o).map(o => o.value).join(','))
  };

  return (
    <Select
      closeMenuOnSelect={false}
      defaultValue={selected}
      isMulti
      options={caveatOptions}
      onChange={handleChange}
    />
  );
}