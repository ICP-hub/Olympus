export const getReactSelectUpdateStyles = (error) => ({
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (provided, state) => ({
    ...provided,
    paddingBlock: '2px',
    borderRadius: '8px',
    borderColor: error ? '#ef4444' : state.isFocused ? '#737373' : '#D1D5DB',
    border: error ? '2px solid #ef4444' : '0px solid #D1D5DA',
    borderWidth: '0px',
    backgroundColor: 'transparent',
    '&::placeholder': {
      color: 'currentColor',
    },
    display: 'flex',
    overflowX: 'auto',
    maxHeight: '35px',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    overflow: 'scroll',
    maxHeight: '40px',
    scrollbarWidth: 'none',
    padding: '0px',
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: 'rgb(107 114 128)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  multiValue: (provided) => ({
    ...provided,
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: '2px solid #6b7280',
    borderRadius: '16px',
    fontSize: '80%',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    display: 'inline-flex',
    alignItems: 'center',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    maxHeight: '35px',
  }),
});

export default getReactSelectUpdateStyles;
