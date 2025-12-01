"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { parseAppleAppId } from "~/lib/parse-app-id";

const platforms = [
  { value: "apple", label: "Apple App Store", emoji: "" },
] as const;

const formSchema = z.object({
  appId: z.string().min(1, "Please enter an App ID"),
  platform: z.enum(["apple"]),
});

export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appId: "",
      platform: "apple",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/${values.platform}/${values.appId}`);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            What Region?
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Check app availability across 170+ countries and regions.
            <br className="hidden sm:inline" />
            See pricing in local currencies worldwide.
          </p>

          <div className="mt-12 mx-auto max-w-md">
            <Form {...form}>
              <form
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Platform</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {platforms.map((platform) => (
                            <option key={platform.value} value={platform.value}>
                              {platform.emoji} {platform.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">App ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter App ID or paste App Store URL"
                          className="h-12 text-base"
                          {...field}
                          onChange={(e) => {
                            const platform = form.getValues("platform");
                            const value =
                              platform === "apple"
                                ? parseAppleAppId(e.target.value)
                                : e.target.value;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="h-12">
                  Check Availability
                </Button>
              </form>
            </Form>

            <p className="mt-4 text-sm text-muted-foreground">
              Paste an App Store URL or enter the ID directly
            </p>
          </div>
        </div>
      </section>

      <section className="container pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Supported Platforms
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="p-6 rounded-lg border bg-card">
              <div className="text-3xl mb-3"></div>
              <h3 className="font-semibold">Apple App Store</h3>
              <p className="text-sm text-muted-foreground mt-1">
                iOS, iPadOS, and macOS apps
              </p>
              <span className="inline-block mt-3 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded">
                Available
              </span>
            </div>
            <div className="p-6 rounded-lg border bg-card opacity-60">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold">Google Play Store</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Android apps and games
              </p>
              <span className="inline-block mt-3 text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                Coming Soon
              </span>
            </div>
            <div className="p-6 rounded-lg border bg-card opacity-60">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="font-semibold">Steam</h3>
              <p className="text-sm text-muted-foreground mt-1">
                PC games and software
              </p>
              <span className="inline-block mt-3 text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
