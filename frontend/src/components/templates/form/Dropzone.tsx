import {
  Box,
  Button,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";
import { Dispatch, SetStateAction, CSSProperties, useState } from "react";

interface Props {
  onUpload: (
    acceptedFiles: File[],
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
}

// Create the UploadImagesButton component
const Dropzone = ({ onUpload }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: {
        // Allow only image files
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      onDrop: (acceptedFiles) => {
        // Handle the uploaded files
        onUpload(acceptedFiles, setIsLoading);
      },
      maxFiles: 5,
    });

  return (
    <Box mt={4}>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        <Button colorScheme="teal" variant="outline" size="md">
          Upload Images
        </Button>
        <Text mt={2} fontSize="sm" color="gray.500">
          {isDragActive
            ? "Drop the images here"
            : "Drag and drop images here, or click to select files"}
        </Text>
      </div>

      {isLoading ? (
        <Box mt={3}>
          <Text fontSize="sm" color="gray.500">
            Uploading files...
          </Text>
        </Box>
      ) : acceptedFiles.length > 0 ? (
        <Box mt={3}>
          <Heading size="sm">Files</Heading>
          <List spacing={3}>
            {acceptedFiles.map((file) => (
              <ListItem key={file.name}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {file.name} - {file.size} bytes
              </ListItem>
            ))}
          </List>
        </Box>
      ) : null}
    </Box>
  );
};

// Define the dropzone style
const dropzoneStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 4,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

export default Dropzone;
