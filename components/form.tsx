import * as React from "react";
import { getAdvise } from "@/app/actions/getAdvise";
import { SetStateAction, useState, Dispatch } from "react";
import {
  Box,
  Button,
  Center,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Text,
} from "@chakra-ui/react";

export function FormComponent({
  transition,
}: {
  transition: React.TransitionStartFunction;
}) {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState([0, 25]);
  const [humidity, setHumidity] = useState([0, 80]);
  const [rain, setRain] = useState(false);
  const [windSpeed, setWindSpeed] = useState(0);
  const [advise, setAdvise] = useState<String[]>([]);
  const modifierAction = (modifierFunction: Dispatch<SetStateAction<any>>) => {
    return (event: any) => {
      modifierFunction(event.target.value);
    };
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    transition(async () => {
      const text = await getAdvise({
        country,
        state,
        city,
        temperature,
        humidity,
        rain,
        windSpeed,
      });
      setAdvise(text.split("\n"));
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(2, 1fr)">
          <GridItem
            p={3}
            border="2px"
            borderColor="teal.700"
            borderRadius="md"
            mx={6}
            my={4}
          >
            <Text fontSize="xl">Location</Text>
            <Box m={2}>
              <FormLabel>Country</FormLabel>
              <Input
                required
                value={country}
                onChange={modifierAction(setCountry)}
              />
            </Box>
            <Box m={2}>
              <FormLabel>State</FormLabel>
              <Input
                required
                value={state}
                onChange={modifierAction(setState)}
              />
            </Box>
            <Box m={2}>
              <FormLabel>City</FormLabel>
              <Input required value={city} onChange={modifierAction(setCity)} />
            </Box>
          </GridItem>
          <GridItem
            p={3}
            border="2px"
            borderColor="orange.300"
            borderRadius="md"
            my={4}
            mx={6}
          >
            <Text fontSize="xl">Weather</Text>
            <Box m={2}>
              <Box m={2}>
                <FormLabel>Temperature (ºC)</FormLabel>
                <RangeSlider
                  min={-15}
                  max={45}
                  defaultValue={temperature}
                  onChange={(val) => setTemperature(val)}
                >
                  <RangeSliderTrack bg="blue">
                    <RangeSliderFilledTrack bg="indigo" />
                  </RangeSliderTrack>
                  <RangeSliderThumb boxSize={6} index={0}>
                    <Box color="indigo">
                      <Text>{temperature[0]}</Text>
                    </Box>
                  </RangeSliderThumb>
                  <RangeSliderThumb boxSize={6} index={1}>
                    <Box color="indigo">
                      <Text>{temperature[1]}</Text>
                    </Box>
                  </RangeSliderThumb>
                </RangeSlider>
              </Box>
            </Box>
            <Box m={2}>
              <Box m={2}>
                <FormLabel>Humidity (%)</FormLabel>
                <RangeSlider
                  min={0}
                  max={100}
                  value={humidity}
                  onChange={(val) => setHumidity(val)}
                >
                  <RangeSliderTrack bg="red.100">
                    <RangeSliderFilledTrack bg="tomato" />
                  </RangeSliderTrack>
                  <RangeSliderThumb boxSize={6} index={0}>
                    <Box color="tomato">
                      <Text>{humidity[0]}</Text>
                    </Box>
                  </RangeSliderThumb>
                  <RangeSliderThumb boxSize={6} index={1}>
                    <Box color="tomato">
                      <Text>{humidity[1]}</Text>
                    </Box>
                  </RangeSliderThumb>
                </RangeSlider>
              </Box>
            </Box>
            <Box m={2}>
              <FormLabel>Rain?</FormLabel>
              <Switch
                value={rain ? "on" : "off"}
                onClick={() => setRain(!rain)}
              />
            </Box>
            <Box m={2}>
              <FormLabel>Wind Speed (MPH)</FormLabel>
              <Slider
                max={10}
                min={0}
                aria-label="slider-ex-4"
                value={windSpeed}
                onChange={(value) => setWindSpeed(value)}
              >
                <SliderTrack bg="silver.100">
                  <SliderFilledTrack bg="gray" />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Box color="gray">
                    <Text>{windSpeed}</Text>
                  </Box>
                </SliderThumb>
              </Slider>
            </Box>
          </GridItem>
        </Grid>
        <Center my={5}>
          <Button bg="blue.200" color="blue.800" type="submit">
            Submit
          </Button>
        </Center>
      </form>
      <Box my={5} mx={10} border="3px" borderRadius="lg" borderColor="teal.700">
        <React.Suspense fallback={<Text>Loading...</Text>}>
          <Heading size="md">Advise</Heading>
          {advise.map((text, index) => (
            <Text key={index}>{text}</Text>
          ))}
        </React.Suspense>
      </Box>
    </>
  );
}

export default FormComponent;
