import React from 'react';
interface SearchBoxProps {
    onSearch?: (text: string) => void;
}

const SearchBox = (props: SearchBoxProps) => {
    const onKeyUp = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.keyCode === 13 && ev.currentTarget.value && props.onSearch) {
            props.onSearch(ev.currentTarget.value);
        }
    };
    return (
        <div>
            <input
                type='text'
                onKeyUp={onKeyUp}
            />
        </div>
    );
};

export default SearchBox;
