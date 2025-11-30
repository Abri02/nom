import { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Field,
  RadioGroup,
} from "@chakra-ui/react";
import { useCart } from "../../../cart/hooks/useCartContext";
import { useNavigate } from "react-router-dom";
import { purple, pink, yellow } from "../../../common/theme/colorScheme";
import type { PaymentMethod } from "../../types/order.types";
import { usePlaceOrder } from "../../hooks";

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const placeOrderMutation = usePlaceOrder();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CASH_ON_DELIVERY");

  if (items.length === 0) {
    return (
      <Box p={6}>
        <Text>Your cart is empty. Please add items before checking out.</Text>
        <Button
          mt={4}
          onClick={() => navigate("/restaurants")}
          bg={purple}
          color="white"
        >
          Browse Restaurants
        </Button>
      </Box>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      const order = await placeOrderMutation.mutateAsync();
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Heading size="3xl" color={purple} mb={6}>
        Checkout
      </Heading>

      <VStack gap={6} align="stretch">
        <Box
          p={6}
          borderWidth="2px"
          borderColor={pink}
          borderRadius="lg"
          bg="white"
        >
          <Heading size="xl" color={purple} mb={4}>
            Order Summary
          </Heading>
          <VStack gap={3} align="stretch">
            {items.map((item) => (
              <HStack key={item.menuItem.id} justify="space-between">
                <Text>
                  {item.menuItem.name} x {item.quantity}
                </Text>
                <Text fontWeight="bold" color={yellow}>
                  {item.lineTotal} Ft
                </Text>
              </HStack>
            ))}
            <Box pt={3} borderTopWidth="2px" borderColor={pink}>
              <HStack justify="space-between" fontSize="xl" fontWeight="bold">
                <Text color={purple}>Total:</Text>
                <Text color={yellow}>{totalPrice} Ft</Text>
              </HStack>
            </Box>
          </VStack>
        </Box>

        {/* 
        <Box
          p={6}
          borderWidth="2px"
          borderColor={pink}
          borderRadius="lg"
          bg="white"
        >
          <Heading size="xl" color={purple} mb={4}>
            Delivery Address
          </Heading>
          <VStack gap={4}>
            <Field.Root required>
              <Field.Label color={purple} fontWeight="600">
                Street
              </Field.Label>
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Enter street address"
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label color={purple} fontWeight="600">
                City
              </Field.Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </Field.Root>
            <Field.Root required>
              <Field.Label color={purple} fontWeight="600">
                Postal Code
              </Field.Label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter postal code"
              />
            </Field.Root>
          </VStack>
        </Box> */}

        <Box
          p={6}
          borderWidth="2px"
          borderColor={pink}
          borderRadius="lg"
          bg="white"
        >
          <Heading size="xl" color={purple} mb={4}>
            Payment Method
          </Heading>
          <RadioGroup.Root
            value={paymentMethod}
            onValueChange={(e) => setPaymentMethod(e.value as PaymentMethod)}
          >
            <VStack gap={2} align="stretch">
              <RadioGroup.Item value="CREDIT_CARD">
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText color={"black"}>
                  Credit Card
                </RadioGroup.ItemText>
              </RadioGroup.Item>
              <RadioGroup.Item value="SZEP_CARD">
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText color={"black"}>
                  SZÉP Card
                </RadioGroup.ItemText>
              </RadioGroup.Item>
              <RadioGroup.Item value="CASH_ON_DELIVERY">
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText color={"black"}>
                  Cash on Delivery
                </RadioGroup.ItemText>
              </RadioGroup.Item>
            </VStack>
          </RadioGroup.Root>
        </Box>

        <Button
          size="lg"
          bg={purple}
          color="white"
          _hover={{ bg: pink }}
          onClick={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
          loading={placeOrderMutation.isPending}
        >
          Place Order
        </Button>
      </VStack>
    </Box>
  );
}
