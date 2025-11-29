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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">App Region Checker</h1>

      <Form {...form}>
        <form
          className="flex flex-col gap-4 max-w-md mb-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="appId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter App ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Check Availability</Button>
        </form>
      </Form>

      {app && <AppInfoCard app={app} />}

      <div className="flex flex-col gap-2 max-w-md">
        {Object.entries(regions).map(([continent, regions]) => (
          <div key={continent} className="mb-4 space-y-3">
            <h3 className="text-lg font-medium mb-2">{startCase(continent)}</h3>
            {regions.map((region) => (
              <RegionCard key={region.code} region={region} appId={appId} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppInfoCard({ app }: { app: AppStoreApp }) {
  return (
    <div className="flex gap-4 p-4 rounded-lg border bg-card max-w-md mb-8">
      <Image
        src={app.artworkUrl100}
        alt={app.trackName}
        width={80}
        height={80}
        className="rounded-xl"
      />
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-lg truncate">{app.trackName}</h2>
        <p className="text-sm text-muted-foreground truncate">
          {app.artistName}
        </p>
        <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
          <span>{app.primaryGenreName}</span>
          <span>{app.formattedPrice}</span>
          <span>v{app.version}</span>
        </div>
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

  if (!appId) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  if (isLoading) {
    return <span className="text-muted-foreground text-sm">...</span>;
  }

  const isAvailable = Boolean(data?.resultCount && data.resultCount > 0);
  const app = data?.results?.[0];

  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`https://apps.apple.com/${region.code}/app/${appId}`}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
    >
      <span className="text-xl">{region.emoji}</span>
      <div className="font-medium">{region.name}</div>
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
    </Link>
  );
}
