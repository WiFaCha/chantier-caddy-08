import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const formSchema = z.object({
  title: z.string().min(1, "Le nom est requis"),
  address: z.string(),
  price: z.number().min(0, "Le prix doit être positif"),
  details: z.string().optional(),
  color: z.enum(["violet", "blue", "green", "red"]),
  type: z.enum(["Mensuel", "Ponctuel"]),
  window_cleaning: z.array(z.string()).default([]),
  monthly_frequency: z.enum(["0x", "1x", "2x"]).optional().default("0x")
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectDialogProps {
  project?: ProjectFormValues;
  onSubmit: (data: ProjectFormValues) => void;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const months = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export function ProjectDialog({ project, onSubmit, trigger, open, onOpenChange }: ProjectDialogProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      address: project?.address || "",
      price: project?.price || 0,
      details: project?.details || "",
      color: project?.color || "violet",
      type: project?.type || "Mensuel",
      window_cleaning: project?.window_cleaning || [],
      monthly_frequency: project?.monthly_frequency || "0x"
    },
  });

  const handleSubmit = async (data: ProjectFormValues) => {
    await onSubmit(data);
    form.reset();
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Modifier le chantier" : "Nouveau chantier"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forfait (€)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Mensuel">Mensuel</SelectItem>
                      <SelectItem value="Ponctuel">Ponctuel</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <div className="flex gap-2 flex-wrap">
                    {["violet", "blue", "green", "red"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-8 w-8 rounded-full ${
                          color === "violet" ? "bg-violet-500" :
                          color === "blue" ? "bg-blue-500" :
                          color === "green" ? "bg-green-500" :
                          "bg-red-500"
                        } ${field.value === color ? "ring-2 ring-offset-2" : ""}`}
                        onClick={() => field.onChange(color)}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="window_cleaning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nettoyage des vitres</FormLabel>
                  <ToggleGroup 
                    type="multiple" 
                    className="flex flex-wrap gap-2"
                    value={field.value || []}
                    onValueChange={field.onChange}
                  >
                    {months.map((month, index) => (
                      <ToggleGroupItem
                        key={month}
                        value={String(index + 1)}
                        className="flex-1 min-w-[calc(25%-0.5rem)]"
                      >
                        {month}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monthly_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fréquence mensuelle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une fréquence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0x">Jamais</SelectItem>
                      <SelectItem value="1x">Une fois par mois</SelectItem>
                      <SelectItem value="2x">Deux fois par mois</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observations</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-20" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {project ? "Modifier" : "Créer"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
