import { faComment, faEye, faFaceSmile, faPerson, faShoePrints, type IconDefinition } from "@fortawesome/free-solid-svg-icons";

export const TYPES = ["Face", "Movement", "Body", "Voice", "Gaze"];
export const EMOTIONS = ["Positive", "Surprised", "Mixed", "Frightened", "Angry", "Negative", "Romantic"];
export const PARTS_OF_SPEECH = ["V", "N", "A"]

export const TYPE_ICONS: Record<string, IconDefinition> = {
  Face: faFaceSmile,
  Movement: faShoePrints,
  Body: faPerson,
  Voice: faComment,
  Gaze: faEye,
};

export const EMOTION_COLORS: Record<string, string> = {
  Positive: "#59168B", // violet
  Surprised: "#1C398E", // sky
  Mixed: "#005F5A", // green
  Frightened: "#497D00", // yellow 
  Angry: "#A65F00", // amber
  Negative: "#9F0712", // red
  Romantic: "#A3004C", // pink
  All: "#262626", // neutral
}

export const PARTS_OF_SPEECH_EXPANSIONS: Record<string, string> = {
  V: "Verb",
  N: "Noun",
  A: "Adjective"
}
