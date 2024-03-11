// import React from "react";

// import { Bid, BidResult, Nft } from "../types/listing";
// import { useEffect } from "react";
// import {
//   ButtonGroup,
//   Flex,
//   IconButton,
//   Button,
//   Table,
//   Tbody,
//   Td,
//   Th,
//   Thead,
//   Tr,
//   useColorModeValue,
//   useToast,
//   Tooltip,
// } from "@chakra-ui/react";
// import {
//   VscAccount,
//   VscChromeClose,
//   VscCheck,
//   VscArrowRight,
//   VscArrowLeft,
// } from "react-icons/vsc";
// import { useAcceptOffer } from "../hooks/marketplace/useBidding";
// import { useNavigate, useLocation } from "react-router-dom";

// interface Props {
//   id: number;
//   address: `0x${string}` | undefined;
//   nft: Nft | undefined;
// }

// const BidMenu = (props: Props) => {
//   const acceptOffer = useAcceptOffer();
//   // const removeBid = useRemoveBid()
//   const toast = useToast();
//   const navigate = useNavigate();
//   const locationHere = useLocation();

//   const header = ["Address", "Bid Price", "Actions"];
//   const color1 = useColorModeValue("gray.400", "gray.400");
//   const color2 = useColorModeValue("gray.400", "gray.400");
//   const { id, address, nft } = props;

//   // FOR LATER WHEN MORE NEEDS TO BE HANDLED AFTER BID IS ACCEPTED BY USER
//   function handleAcceptBid(
//     address: `0x${string}` | undefined,
//     id: number,
//     bidder: `0x${string}` | undefined
//   ) {
//     acceptOffer.mutate({ address, id, bidder });
//   }

//   // useEffect(() => {
//   //   // When the mutation is loading, show a toast
//   //   if (removeBid.isPending) {
//   //     toast({
//   //       status: "loading",
//   //       title: "Removing Bid...",
//   //       description: "Please confirm on Metamask.",
//   //     });
//   //   }

//   //   // When the mutation fails, show a toast
//   //   if (removeBid.isError) {
//   //     toast({
//   //       status: "error",
//   //       title: "An error occured",
//   //       description: "Something wrong",
//   //       duration: 5000,
//   //     });
//   //   }

//   //   // When the mutation is successful, show a toast
//   //   if (removeBid.isSuccess) {
//   //     toast({
//   //       status: "success",
//   //       title: "Bid Removed",
//   //       description: "Looks great!",
//   //       duration: 5000,
//   //     });
//   //     window.setTimeout(function(){location.reload()},10000);
//   //   }
//   // }, [removeBid]);

//   useEffect(() => {
//     // When the mutation is loading, show a toast
//     if (acceptOffer.isPending) {
//       toast({
//         status: "loading",
//         title: "Accepting Bid...",
//         description: "Please confirm on Metamask.",
//       });
//     }

//     // When the mutation fails, show a toast
//     if (acceptOffer.isError) {
//       toast({
//         status: "error",
//         title: "An error occured",
//         description: "Something went wrong.",
//         duration: 5000,
//       });
//     }

//     // When the mutation is successful, show a toast
//     if (acceptOffer.isSuccess) {
//       toast({
//         status: "success",
//         title: "Bid Accepted",
//         description: "Looks great! Waiting on Buyer to approve.",
//         duration: 5000,
//       });
//       window.setTimeout(function () {
//         location.reload();
//       }, 10000);
//     }
//   }, [acceptOffer]);

//   return (
//     <Flex
//       w="full"
//       bg="#edf3f8"
//       _dark={{ bg: "#3e3e3e" }}
//       p={50}
//       alignItems="center"
//       justifyContent="center"
//     >
//       {locationHere.pathname == "/property" ? (
//         <Button
//           rightIcon={<VscArrowRight />}
//           colorScheme="blue"
//           onClick={() =>
//             navigate("/property/bids", {
//               state: { id: nft?.property.propertyId },
//             })
//           }
//           aria-label="More"
//           size="sm"
//           position="absolute"
//           right={5}
//           bottom={5}
//         >
//           View More
//         </Button>
//       ) : (
//         <Button
//           leftIcon={<VscArrowLeft />}
//           colorScheme="blue"
//           onClick={() =>
//             navigate("/property", { state: { id: nft?.property.propertyId } })
//           }
//           aria-label="More"
//           size="sm"
//           position="absolute"
//           right={5}
//           bottom={0}
//         >
//           View Less
//         </Button>
//       )}

//       <Table
//         w="full"
//         bg="white"
//         _dark={{ bg: "gray.800" }}
//         display={{
//           base: "block",
//           md: "table",
//         }}
//         sx={{
//           "@media print": {
//             display: "table",
//           },
//         }}
//       >
//         <Thead
//           display={{
//             base: "none",
//             md: "table-header-group",
//           }}
//           sx={{
//             "@media print": {
//               display: "table-header-group",
//             },
//           }}
//         >
//           <Tr>
//             {header.map((x) => (
//               <Th key={x}>{x}</Th>
//             ))}
//           </Tr>
//         </Thead>
//         <Tbody
//           display={{
//             base: "block",
//             lg: "table-row-group",
//           }}
//           sx={{
//             "@media print": {
//               display: "table-row-group",
//             },
//           }}
//         >
//           {nft?.listing?.bids?.map((bid: Bid, tid: number) => {
//             return (
//               <Tr
//                 key={tid}
//                 display={{
//                   base: "grid",
//                   md: "table-row",
//                 }}
//                 sx={{
//                   "@media print": {
//                     display: "table-row",
//                   },
//                   gridTemplateColumns: "minmax(0px, 65%) minmax(0px, 35%)",
//                   gridGap: "10px",
//                 }}
//               >
//                 {Object.keys(bid).map((x) => {
//                   return (
//                     <React.Fragment key={`${tid}${x}`}>
//                       <Td
//                         display={{
//                           base: "table-cell",
//                           md: "none",
//                         }}
//                         sx={{
//                           "@media print": {
//                             display: "none",
//                           },
//                           textTransform: "uppercase",
//                           color: color1,
//                           fontSize: "xs",
//                           fontWeight: "bold",
//                           letterSpacing: "wider",
//                           fontFamily: "heading",
//                         }}
//                       >
//                         {x}
//                       </Td>
//                       <Td
//                         color={"gray.500"}
//                         fontSize="md"
//                         fontWeight="hairline"
//                       >
//                         {bid[x].toString()}
//                       </Td>
//                     </React.Fragment>
//                   );
//                 })}
//                 <Td
//                   display={{
//                     base: "table-cell",
//                     md: "none",
//                   }}
//                   sx={{
//                     "@media print": {
//                       display: "none",
//                     },
//                     textTransform: "uppercase",
//                     color: color2,
//                     fontSize: "xs",
//                     fontWeight: "bold",
//                     letterSpacing: "wider",
//                     fontFamily: "heading",
//                   }}
//                 >
//                   Actions
//                 </Td>
//                 <Td>
//                   <ButtonGroup variant="solid" size="sm" spacing={3}>
//                     {nft?.owner == address && (
//                       <Tooltip label="Accept Offer" fontSize="sm">
//                         <IconButton
//                           colorScheme="teal"
//                           icon={<VscCheck />}
//                           aria-label="Accept"
//                           onClick={() => {
//                             acceptOffer.mutate({
//                               address,
//                               id,
//                               bidder: bid.bidder,
//                             });
//                           }}
//                         />
//                       </Tooltip>
//                     )}
//                     <Tooltip label="Remove Offer" fontSize="sm">
//                       <IconButton
//                         colorScheme="red"
//                         icon={<VscChromeClose />}
//                         aria-label="Reject"
//                         onClick={() => {
//                           removeBid.mutate({
//                             address,
//                             id,
//                             bidder: bid[0] as `0x${string}`,
//                           });
//                         }}
//                       />
//                     </Tooltip>
//                     <Tooltip label="View Profile" fontSize="sm">
//                       <IconButton
//                         colorScheme="blue"
//                         variant="outline"
//                         icon={<VscAccount />}
//                         aria-label="View"
//                       />
//                     </Tooltip>
//                   </ButtonGroup>
//                 </Td>
//               </Tr>
//             );
//           })}
//         </Tbody>
//       </Table>
//     </Flex>
//   );
// };

// export { BidMenu };
