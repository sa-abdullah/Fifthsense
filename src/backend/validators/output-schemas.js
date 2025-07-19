import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

export const advisorResponseParser = StructuredOutputParser.fromZodSchema(
  z.object({
    content: z.string(),
    suggestions: z.array(z.string()).optional(),
    analysis: z.object({
      rating: z.enum(["Buy", "Sell", "Hold"]),
      currentPrice: z.string(),
      targetPrice: z.string(),
      upside: z.string()
    }).optional()
  })
);
