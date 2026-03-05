"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  PlusIcon, Trash2Icon, Settings2, Activity, X, Cpu, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { 
  Dialog, DialogContent, DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, FormControl, FormField, FormItem, FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { conditionalFormSchema, type ConditionalFormValues, type ConditionalNodeData } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ConditionalFormValues) => void;
  defaultValues?: Partial<ConditionalNodeData>;
}

export const ConditionalDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<ConditionalFormValues>({
    resolver: zodResolver(conditionalFormSchema) as any,
    defaultValues: {
      variableName: defaultValues.variableName || "logic_gate",
      logicalOperator: defaultValues.logicalOperator || "and",
      conditions: defaultValues.conditions || [{ 
        id: crypto.randomUUID(), 
        leftValue: "{{value}}", 
        operator: "equals", 
        rightValue: "", 
        caseSensitive: false 
      }],
      trueBranchName: defaultValues.trueBranchName || "SUCCESS",
      falseBranchName: defaultValues.falseBranchName || "FAILURE",
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "conditions" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 1. Fixed width at max-w-3xl to stop horizontal squishing 
         2. h-[90vh] ensures it takes up vertical space 
         3. flex-col keeps the footer pinned while the middle scrolls
      */}
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden border-zinc-800 bg-[#09090B] text-zinc-100 rounded-none shadow-2xl flex flex-col h-[90vh]">
        
        {/* HEADER: Pinned at top */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/50 text-[#FF6B00]">
              <Cpu className="size-6" />
            </div>
            <div>
              <DialogTitle className="text-xs font-black uppercase tracking-[4px]">Logic_Engine_v2.0</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Status: Online // Logic_Active</span>
              </div>
            </div>
          </div>
       
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
          <div className="p-8 space-y-10">
            
            {/* SIDEBAR-STYLE INFO (Now at top for vertical flow) */}
            <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-8">
              <section className="space-y-2">
                <h4 className="text-[9px] font-black uppercase text-[#FF6B00] tracking-widest flex items-center gap-2">
                  <Settings2 className="size-3" /> System_Brief
                </h4>
                <p className="text-[10px] leading-relaxed text-zinc-400">
                  Route packets based on conditional logic. Use <span className="text-zinc-100 font-mono">{"{{value}}"}</span> for variables.
                </p>
              </section>
              <section className="space-y-2">
                <h4 className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                  <Activity className="size-3" /> Operation_Mode
                </h4>
                <p className="text-[10px] leading-relaxed text-zinc-500 italic">
                  AND requires all pass. OR requires single pass.
                </p>
              </section>
            </div>

            <Form {...form}>
              <form className="space-y-10">
                
                {/* GLOBAL SETTINGS */}
                <div className="grid grid-cols-1 gap-6 p-6 bg-zinc-900/20 border border-zinc-800/50">
                  <FormField
                    control={form.control}
                    name="variableName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Process_Identifier</FormLabel>
                        <Input className="bg-black border-zinc-800 rounded-none h-10 font-mono text-xs text-[#FF6B00]" {...field} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logicalOperator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Gate_Function</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="bg-black border-zinc-800 rounded-none h-10 font-bold uppercase text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 rounded-none">
                            <SelectItem value="and" className="uppercase font-bold text-[10px]">AND_GATE</SelectItem>
                            <SelectItem value="or" className="uppercase font-bold text-[10px]">OR_GATE</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* CONDITION BUILDER (The part that grows) */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500">Circuit_Rules</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ id: crypto.randomUUID(), leftValue: "{{value}}", operator: "equals", rightValue: "", caseSensitive: false })}
                      className="h-8 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-black transition-all rounded-none text-[9px] font-black uppercase"
                    >
                      <PlusIcon className="size-3 mr-2" /> Add_Rule
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        key={field.id} 
                        className="p-4 bg-zinc-900/40 border border-zinc-800 space-y-3 relative group"
                      >
                        <div className="flex gap-2">
                           <Input 
                            placeholder="Input"
                            className="flex-1 bg-black border-zinc-800 h-9 text-[11px] font-mono rounded-none"
                            {...form.register(`conditions.${index}.leftValue` as const)}
                          />
                          <Select 
                            defaultValue={field.operator}
                            onValueChange={(val) => form.setValue(`conditions.${index}.operator`, val as any)}
                          >
                            <SelectTrigger className="w-32 bg-black border-zinc-800 h-9 text-[9px] font-black uppercase rounded-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 rounded-none">
                              {["equals", "notEquals", "contains", "greaterThan", "lessThan"].map(op => (
                                <SelectItem key={op} value={op} className="uppercase text-[9px] font-bold">{op}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input 
                            placeholder="Value"
                            className="flex-1 bg-black border-zinc-800 h-9 text-[11px] font-mono rounded-none"
                            {...form.register(`conditions.${index}.rightValue` as const)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-zinc-600 hover:text-red-500"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* OUTPUT ROUTING */}
                <div className="grid grid-cols-1 gap-4 pt-6 border-t border-zinc-800">
                   <div className="space-y-2">
                    <FormLabel className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Route_A (Pass)</FormLabel>
                    <Input className="bg-emerald-500/5 border-emerald-500/30 rounded-none h-10 uppercase font-black text-xs text-emerald-400" {...form.register("trueBranchName")} />
                  </div>
                  <div className="space-y-2">
                    <FormLabel className="text-[9px] font-black uppercase text-red-500 tracking-widest">Route_B (Fail)</FormLabel>
                    <Input className="bg-red-500/5 border-red-500/30 rounded-none h-10 uppercase font-black text-xs text-red-400" {...form.register("falseBranchName")} />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* FOOTER: Pinned at bottom */}
        <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-between items-center shrink-0">
          <div className="text-[9px] font-mono text-zinc-500 uppercase">
             Active_Rules: <span className="text-white font-black">{fields.length}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-none border-zinc-700 text-zinc-400 h-10 px-6 text-[10px] uppercase font-black">Abort</Button>
            <Button onClick={form.handleSubmit(onSubmit)} className="rounded-none bg-[#FF6B00] text-black hover:bg-[#FF6B00]/90 h-10 px-8 text-[10px] uppercase font-black">Deploy</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};