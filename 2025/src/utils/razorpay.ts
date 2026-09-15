import Router from "next/router";
import toast from "react-hot-toast";
import { CONSTANT } from "~/constants";

import { env } from "~/env";
import {
  EventPaymentOrderDocument,
  FestRegPaymentOrderDocument,
} from "~/generated/generated";
import { client } from "~/lib/apollo";

export const initializeRazorpay = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const makePayment = async (setSDKLoading?: (_: boolean) => void) => {
  if (setSDKLoading) setSDKLoading(true);

  const res = await initializeRazorpay();
  if (!res) alert("Razorpay SDK Failed to load");

  const { data } = await client.mutate({
    mutation: FestRegPaymentOrderDocument,
  });

  if (
    data?.createPaymentOrder.__typename === "MutationCreatePaymentOrderSuccess"
  ) {
    const options: RazorpayOptions = {
      key: env.NEXT_PUBLIC_RAZORPAY_KEY,
      name: `Incridea ${CONSTANT.YEAR}`,
      currency: "INR",
      amount: data.createPaymentOrder.data.amount,
      order_id: data.createPaymentOrder.data.orderId,
      description: `Incridea ${CONSTANT.YEAR} Registration`,
      image: "/logo.webp",
      handler: async function () {
        await client.refetchQueries({
          include: ["MeQuery"],
        });
        await Router.push("/profile");
      },
      prefill: {
        email: data.createPaymentOrder.data.user.email,
        name: data.createPaymentOrder.data.user.name,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } else {
    toast.error("Something went wrong");
    console.log(data);
  }

  if (setSDKLoading) setSDKLoading(false);
};

export const makeTeamPayment = async (
  teamId: string,
  name: string,
  email: string,
  setSDKLoading?: (_: boolean) => void,
) => {
  if (setSDKLoading) setSDKLoading(true);

  const res = await initializeRazorpay();
  if (!res) alert("Razorpay SDK Failed to load");

  const { data } = await client.mutate({
    mutation: EventPaymentOrderDocument,
    variables: {
      teamId,
    },
  });
  if (
    data?.eventPaymentOrder.__typename === "MutationEventPaymentOrderSuccess"
  ) {
    const options = {
      key: env.NEXT_PUBLIC_RAZORPAY_KEY,
      name: `Incridea ${CONSTANT.YEAR}`,
      currency: "INR",
      amount: data.eventPaymentOrder.data.amount,
      order_id: data.eventPaymentOrder.data.orderId,
      description: `Register for ${data.eventPaymentOrder.data.Team.event.name}`,
      image: "/logo.webp",
      handler: async function () {
        await client.refetchQueries({
          include: ["MyTeam"],
        });
      },
      prefill: {
        email: email,
        name: name,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } else {
    alert("Something went wrong");
    console.log(data);
  }

  if (setSDKLoading) setSDKLoading(false);
};
