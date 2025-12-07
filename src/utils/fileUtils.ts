/**
 * Converte um objeto File (imagem local) em uma string Base64.
 * @param file O arquivo de imagem.
 * @returns Promise que resolve com a string Base64 ou null em caso de erro.
 */
export const fileToBase64 = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!file) {
      return resolve(null);
    }

    const reader = new FileReader();

    // Define o que acontece após a leitura do arquivo
    reader.onloadend = () => {
      // reader.result é a string Base64 (data URL)
      resolve(reader.result as string);
    };

    // Trata possíveis erros
    reader.onerror = () => {
      console.error("Erro ao ler o arquivo como Base64.");
      resolve(null);
    };

    // Inicia a leitura do arquivo
    reader.readAsDataURL(file);
  });
};
