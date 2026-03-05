"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { 
  Globe, 
  X, 
  Hash, 
  Link2, 
  Activity, 
  ShieldCheck, 
  Rocket, 
  Code2, 
  ChevronRight,
  Database
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  variableName: z.string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_$][A-Za-z0-9_$]*$/, {
      message: "Must start with letter/underscore and contain only letters/numbers"
    }),
  endpoint: z.string().min(1, "Please enter a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional()
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;

const METHOD_COLORS = {
  GET: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  POST: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  PUT: "text-amber-400 border-amber-400/30 bg-amber-400/5",
  PATCH: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  DELETE: "text-red-400 border-red-400/30 bg-red-400/5",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HttpRequestFormValues) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "myApiCall",
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    }
  });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  const watchMethod = form.watch("method");
  const watchVariableName = form.watch("variableName") || "myApiCall";
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[750px] w-[95vw] h-[85vh] p-0 flex flex-col overflow-hidden border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)]">
        
        {/* HEADER */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-950/50 shrink-0">
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <Globe className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                HTTP Protocol
                <Badge variant="outline" className={`text-[8px] px-1.5 py-0 h-4 ${METHOD_COLORS[watchMethod]}`}>
                  {watchMethod}
                </Badge>
              </DialogTitle>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Activity className="size-2.5" /> Network_Dispatcher
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="text-zinc-500 hover:text-white">
            <X className="size-5" />
          </Button>
        </div>

        {/* FORM CONTENT */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <ScrollArea className="flex-1 w-full">
              <div className="p-6 space-y-8">
                
                {/* IDENTIFIER SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="variableName" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-500/70">
                        <Hash className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">Variable_Reference</FormLabel>
                      </div>
                      <FormControl>
                        <Input className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs font-mono text-zinc-300 focus:border-blue-500/50" {...field} />
                      </FormControl>
                      <FormDescription className="text-[9px] text-zinc-600">
                        Access: <code className="text-blue-500">{`{{${watchVariableName}.data}}`}</code>
                      </FormDescription>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="method" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-500/70">
                        <ChevronRight className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">Request_Method</FormLabel>
                      </div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                            <SelectItem key={m} value={m} className="text-xs font-bold">
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>

                {/* ENDPOINT SECTION */}
                <FormField control={form.control} name="endpoint" render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-500/70">
                      <Link2 className="size-3" />
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest">Target_Endpoint</FormLabel>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="https://api.service.com/v1/resource" 
                        className="bg-zinc-900/50 border-zinc-800 rounded-xl h-11 text-xs font-mono text-zinc-300" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-[9px] text-zinc-600">
                      Supports dynamic pathing: <code className="bg-zinc-800 px-1 rounded">/users/&#123;&#123;id&#125;&#125;</code>
                    </FormDescription>
                  </FormItem>
                )} />

                {/* BODY SECTION */}
                {showBodyField && (
                  <FormField control={form.control} name="body" render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-500/70">
                        <Code2 className="size-3" />
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest">JSON_Payload</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea 
                          className="min-h-[200px] border-zinc-800 rounded-xl font-mono text-xs bg-zinc-900/30 text-zinc-300 p-4 focus:border-blue-500/30 resize-none leading-relaxed" 
                          placeholder={'{\n  "key": "{{value}}"\n}'} 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                )}
              </div>
            </ScrollArea>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-950/50 shrink-0">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-3.5 text-blue-500/50" />
                <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Secure_Transport</span>
                <Separator orientation="vertical" className="h-4 bg-zinc-800" />
                <Database className="size-3 text-zinc-600" />
                <span className="text-[8px] text-zinc-600 font-mono">Payload_Ready</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)} 
                  className="text-[10px] font-black uppercase text-zinc-500 h-9 px-4"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 h-9 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  <Rocket className="size-3.5" />
                  Save Config
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};