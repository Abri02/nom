import {
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerBackdrop,
  DrawerCloseTrigger,
  Box,
  Text,
  Button,
  HStack,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { useCart } from "../hooks/useCartContext";
import { purple, pink, yellow } from "../../common/theme/colorScheme";

interface CartDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
      size="md"
      lazyMount
      unmountOnExit
    >
      <DrawerBackdrop />
      <DrawerContent
        bg="white"
        height="100vh"
        overflowY="auto"
        position="fixed"
        top={0}
        right={0}
        zIndex={2000}
      >
        <DrawerCloseTrigger bg={pink} color="white">
          <X />
        </DrawerCloseTrigger>
        <DrawerHeader borderBottomWidth="2px" borderColor={pink}>
          <DrawerTitle fontSize="2xl" color={purple}>
            🛒 Your Cart ({totalItems})
          </DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          {items.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text fontSize="xl" color="gray.500">
                Your cart is empty
              </Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                Add items from the menu to get started
              </Text>
            </Box>
          ) : (
            <VStack gap={4} align="stretch">
              {items.map((item) => (
                <Box
                  key={item.menuItem.id}
                  p={4}
                  borderWidth="2px"
                  borderColor={pink}
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Text fontSize="lg" fontWeight="bold" color={purple} mb={1}>
                    {item.menuItem.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {item.restaurantName}
                  </Text>
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <IconButton
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.menuItem.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        bg={purple}
                        color="white"
                        _hover={{ bg: pink }}
                      >
                        −
                      </IconButton>
                      <Text
                        fontWeight="bold"
                        minW="30px"
                        color={purple}
                        textAlign="center"
                      >
                        {item.quantity}
                      </Text>
                      <IconButton
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.menuItem.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        bg={purple}
                        color="white"
                        _hover={{ bg: pink }}
                      >
                        +
                      </IconButton>
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color={yellow}>
                      {item.lineTotal} Ft
                    </Text>
                  </HStack>
                  <Button
                    size="sm"
                    mt={2}
                    onClick={() => removeItem(item.menuItem.id)}
                    width="full"
                    bg="red.500"
                    color="white"
                    _hover={{ bg: "red.600" }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </VStack>
          )}
        </DrawerBody>

        <DrawerFooter
          borderTopWidth="2px"
          borderColor={pink}
          flexDirection="column"
          gap={3}
        >
          <HStack
            width="full"
            justify="space-between"
            fontSize="2xl"
            fontWeight="bold"
          >
            <Text color={purple}>Total:</Text>
            <Text color={yellow}>{totalPrice} Ft</Text>
          </HStack>
          {items.length > 0 && (
            <>
              <Button
                width="full"
                size="lg"
                bg={purple}
                color="white"
                _hover={{ bg: pink }}
              >
                Checkout
              </Button>
              <Button
                width="full"
                onClick={clearCart}
                borderWidth="2px"
                borderColor={purple}
                color={purple}
                bg="white"
                _hover={{ bg: "gray.50" }}
              >
                Clear Cart
              </Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
}
