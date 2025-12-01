"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconExternalLink } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startCase } from "es-toolkit";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { lookupApp } from "~/lib/app-store";
import regions from "~/lib/regions";
import type { AppStoreApp } from "~/lib/types";

const formSchema = z.object({
  appId: z.string().min(1),
});

export default function Home() {
  const { id: appId } = useParams<{ id: string }>();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appId: appId ?? "",
    },
  });

  const queryClient = useQueryClient();

  const { data: appInfo } = useQuery({
    queryKey: ["app-info", appId],
    queryFn: () => lookupApp(appId, "us"),
    enabled: !!appId,
  });

  const app = appInfo?.results?.[0];

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/${values.appId}`);
    queryClient.invalidateQueries();
  }

  return (
    <main className="container py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">App Region Checker</h1>
        <p className="text-muted-foreground mt-2">
          Check App Store availability across 170+ countries and regions
        </p>
      </header>

      <section aria-label="App search" className="mb-8">
        <Form {...form}>
          <form
            className="flex flex-col gap-4 max-w-md"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="appId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter App Store ID (e.g., 6743941366)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Check Availability</Button>
          </form>
        </Form>
      </section>

      {app && (
        <article aria-label="App information">
          <AppInfoCard app={app} />
        </article>
      )}

      <section aria-label="Regional availability" className="max-w-md">
        <h2 className="sr-only">Availability by Region</h2>
        {Object.entries(regions).map(([continent, regionList]) => (
          <div key={continent} className="mb-6">
            <h3 className="text-lg font-medium mb-3">{startCase(continent)}</h3>
            <ul className="space-y-2">
              {regionList.map((region) => (
                <li key={region.code}>
                  <RegionCard region={region} appId={appId} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}

function AppInfoCard({ app }: { app: AppStoreApp }) {
  return (
    <div className="flex gap-4 p-4 rounded-lg border bg-card max-w-md mb-8">
      <Image
        src={app.artworkUrl100}
        alt={`${app.trackName} app icon`}
        width={80}
        height={80}
        className="rounded-xl"
        priority
      />
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-lg truncate">{app.trackName}</h2>
        <p className="text-sm text-muted-foreground truncate">
          by {app.artistName}
        </p>
        <dl className="flex gap-3 mt-2 text-sm text-muted-foreground">
          <div>
            <dt className="sr-only">Category</dt>
            <dd>{app.primaryGenreName}</dd>
          </div>
          <div>
            <dt className="sr-only">Price</dt>
            <dd>{app.formattedPrice}</dd>
          </div>
          <div>
            <dt className="sr-only">Version</dt>
            <dd>v{app.version}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function RegionCard({
  appId,
  region,
}: {
  appId: string;
  region: (typeof regions.europe)[0];
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["app-status", appId, region.code],
    queryFn: () => lookupApp(appId, region.code),
    enabled: !!appId,
  });

  const isAvailable = Boolean(data?.resultCount && data.resultCount > 0);
  const app = data?.results?.[0];

  const Container = isAvailable ? Link : "div";

  return (
    <Container
      target="_blank"
      rel="noopener noreferrer"
      href={`https://apps.apple.com/${region.code}/app/${appId}`}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
    >
      <span className="text-xl">{region.emoji}</span>
      <div className="font-medium">{region.name}</div>

      {appId && (
        <>
          <IconExternalLink className="w-4 h-4" />

          <div className="flex items-center gap-2 ml-auto">
            {isAvailable && app && (
              <span className="text-sm text-muted-foreground">
                {app.formattedPrice}
              </span>
            )}

            <span className={isAvailable ? "text-green-600" : "text-red-500"}>
              {isAvailable ? "✓" : "✗"}
            </span>
          </div>
        </>
      )}

      {!appId && isLoading && <span className="text-muted-foreground text-sm">...</span>}
    </Container>
  );
}
