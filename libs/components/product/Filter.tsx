import React, { useState } from "react";
import {
  IconButton,
  OutlinedInput,
  Typography,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const priceRanges = [0, 5000, 10000, 20000, 50000, 100000, 200000, 500000];

const Filter = () => {
  const [searchText, setSearchText] = useState("");
  const [productPrice, setProductPrice] = useState({
    start: 0,
    end: 500000,
  });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [showMoreLocations, setShowMoreLocations] = useState(false);

  const handleReset = () => {
    setSearchText("");
    setProductPrice({ start: 0, end: 500000 });
    setSelectedTypes([]);
    setSelectedLocations([]);
    setSelectedConditions([]);
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleConditionChange = (condition) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <Stack className="filter-main" sx={{ gap: '30px' }}>
      <Stack className="find-your-home">
        <Typography className="title-main" sx={{ fontSize: '24px', fontWeight: 600, mb: 2 }}>
          Find Products
        </Typography>
        <Stack className="input-box" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <OutlinedInput
            value={searchText}
            type="text"
            className="search-input"
            placeholder="What are you looking for?"
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ width: '100%', pr: 8 }}
          />
          <Stack sx={{ position: 'absolute', right: 8, flexDirection: 'row', gap: 1 }}>
            <img src="/img/icons/search_icon.png" alt="" style={{ width: 20, height: 20 }} />
            <Tooltip title="Reset">
              <IconButton onClick={handleReset} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>

      <Stack className="find-your-home">
        <Typography className="title" sx={{ fontSize: '18px', fontWeight: 600, mb: 2, textShadow: '0px 3px 4px #b9b9b9' }}>
          Product Type
        </Typography>
        <Stack sx={{ gap: 1 }}>
          {["BOOK", "NOTE", "ELECTRONIC", "FASHION", "ACCESSORY", "HOME", "SERVICE", "OTHER"].map((type) => (
            <Stack className="input-box" key={type} sx={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                id={type}
                className="property-checkbox"
                color="default"
                size="small"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
              />
              <label htmlFor={type} style={{ cursor: 'pointer' }}>
                <Typography className="property-type" sx={{ fontSize: '14px' }}>
                  {type.replace('_', ' ')}
                </Typography>
              </label>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack className="find-your-home">
        <Typography className="title" sx={{ fontSize: '18px', fontWeight: 600, mb: 2 }}>
          Location
        </Typography>
        <Stack 
          className="property-location"
          sx={{ 
            gap: 1,
            height: showMoreLocations ? 'auto' : '120px',
            overflow: 'hidden',
            transition: 'height 0.3s ease'
          }}
        >
          {["DORMITORY", "MAIN_GATE", "LIBRARY", "CAFETERIA", "SPORT_CENTER", "STUDENT_CENTER", "BUS_STOP", "OTHER"].map((location) => (
            <Stack className="input-box" key={location} sx={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                id={location}
                className="property-checkbox"
                color="default"
                size="small"
                checked={selectedLocations.includes(location)}
                onChange={() => handleLocationChange(location)}
              />
              <label htmlFor={location} style={{ cursor: 'pointer' }}>
                <Typography className="property-type" sx={{ fontSize: '14px' }}>
                  {location.replace(/_/g, ' ')}
                </Typography>
              </label>
            </Stack>
          ))}
        </Stack>
        <Button 
          onClick={() => setShowMoreLocations(!showMoreLocations)}
          sx={{ mt: 1, fontSize: '12px' }}
        >
          {showMoreLocations ? 'Show Less' : 'Show More'}
        </Button>
      </Stack>

      <Stack className="find-your-home">
        <Typography className="title" sx={{ fontSize: '18px', fontWeight: 600, mb: 2 }}>
          Condition
        </Typography>
        <Stack sx={{ gap: 1 }}>
          {["NEW", "LIKE_NEW", "GOOD", "USED", "BAD"].map((condition) => (
            <Stack className="input-box" key={condition} sx={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox
                id={condition}
                className="property-checkbox"
                color="default"
                size="small"
                checked={selectedConditions.includes(condition)}
                onChange={() => handleConditionChange(condition)}
              />
              <label htmlFor={condition} style={{ cursor: 'pointer' }}>
                <Typography className="property-type" sx={{ fontSize: '14px' }}>
                  {condition.replace(/_/g, ' ')}
                </Typography>
              </label>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack className="find-your-home">
        <Typography className="title" sx={{ fontSize: '18px', fontWeight: 600, mb: 2 }}>
          Price Range
        </Typography>
        <Stack className="square-year-input" sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <input 
            type="number"
            placeholder="₩ min"
            min={0}
            value={productPrice?.start ?? 0}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setProductPrice({ ...productPrice, start: e.target.value });
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #b9b9b9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <div className="central-divider" style={{ width: '20px', height: '1px', backgroundColor: '#b9b9b9' }}></div>
          <input 
            type="number"
            placeholder="₩ max"
            value={productPrice?.end ?? 0}
            onChange={(e) => {
              if (e.target.value >= 0) {
                setProductPrice({ ...productPrice, end: e.target.value });
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #b9b9b9',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </Stack>
      </Stack>

      <Button 
        variant="contained" 
        fullWidth
        sx={{ 
          mt: 2, 
          py: 1.5,
          borderRadius: '12px',
          textTransform: 'none',
          fontSize: '16px',
          fontWeight: 600
        }}
      >
        Apply Filters
      </Button>
    </Stack>
  );
};

export default Filter;