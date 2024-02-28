import React, { useState, useEffect } from "react";
import { SearchBar } from "@rneui/themed";

function SearchBarComponent({
  search,
  setSearch,
  placeholder,
  data,
  setFilteredDataSource,
  onPressSearch,
  handlerOnPressCancel,
}) {
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    setFilteredDataSource(data);
    setMasterDataSource(data);
  }, [data]);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  return (
    <SearchBar
      placeholder={placeholder}
      lightTheme={true}
      round={true}
      onFocus={() => {
        searchFilterFunction(search);
        onPressSearch();
        handleFocus();
      }}
      onBlur={handleBlur}
      onChangeText={(text) => {
        searchFilterFunction(text);
      }}
      onClear={handlerOnPressCancel}
      value={search}
      containerStyle={{
        backgroundColor: "transparent",
        borderColor: "transparent",
      }}
      inputContainerStyle={{
        backgroundColor: isFocused ? "#265437" : "#E1E6E1",
      }}
    />
  );
}

export default SearchBarComponent;
