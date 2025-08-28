export default interface AnimalMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string;
  photoUri: string;
  selectedDate: string;
  selectedTime: string;
}
