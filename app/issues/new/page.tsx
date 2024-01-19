"use client";
import { Button, Callout, CalloutText, Text, TextField } from "@radix-ui/themes";
import SimpleMde from "react-simplemde-editor";
import { useForm, Controller } from "react-hook-form";
import "easymde/dist/easymde.min.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { createIssueSchema } from "@/app/api/createIssueSchema";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: {errors} } = useForm<IssueForm>({
        resolver: zodResolver(createIssueSchema)
    });
    const [error, setError] = useState("");
    const [isSubmitting, setSubmitting] = useState(false);
    return (
        <div className="max-w-xl">
            {error && (
                <Callout.Root color="red" className="mb-5">
                    <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
            )}
            <form
                className="max-w-xl space-y-3"
                onSubmit={handleSubmit(async (data) => {
                    try {
                        setSubmitting(true);
                        await axios.post("/api/issues)", data);
                        router.push("/issues");
                    } catch (error) {
                        setSubmitting(false);
                        setError("An unexpected error has occurred");
                    }
                })}
            >
                <TextField.Root>
                    <TextField.Input
                        placeholder="Title"
                        {...register("title")}
                    />
                </TextField.Root>
                <ErrorMessage>{errors.title?.message}</ErrorMessage>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <SimpleMde placeholder="Description" {...field} />
                    )}
                ></Controller>
                <ErrorMessage>{errors.description?.message}</ErrorMessage>

                <Button disabled={isSubmitting}>Submit New Issue {isSubmitting && <Spinner />}</Button>
            </form>
        </div>
    );
};

export default NewIssuePage;
