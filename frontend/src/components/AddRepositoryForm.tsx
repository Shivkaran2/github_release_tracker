import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REPOSITORY_MUTATION, REPOSITORIES_QUERY } from '../graphql';
import type { Repository } from '../types/repository';

type AddRepositoryFormProps = {
  onAdded?: (repository: Repository | null | undefined) => void;
};

export function AddRepositoryForm({ onAdded }: AddRepositoryFormProps) {
  const [input, setInput] = useState('');
  const [addRepository, { loading, error }] = useMutation<
    { addRepository: Repository },
    { url: string }
  >(ADD_REPOSITORY_MUTATION, {
    refetchQueries: [REPOSITORIES_QUERY],
    awaitRefetchQueries: true,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }

    try {
      const result = await addRepository({
        variables: { url: input.trim() },
      });
      setInput('');
      onAdded?.(result.data?.addRepository);
    } catch (mutationError) {}
  };

  return (
    <form className="add-repo-form" onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="https://github.com/owner/repo"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding…' : 'Add'}
      </button>
      {error ? <p className="form-error">{error.message}</p> : null}
    </form>
  );
}
