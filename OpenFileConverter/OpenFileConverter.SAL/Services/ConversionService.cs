using System;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;

namespace OpenFileConverter.SAL.Services
{
    public class ConversionService
    {
        public ConversionService()
        {
            SetFFmpegPath();
            FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official).Wait();
        }

        private void SetFFmpegPath()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                FFmpeg.SetExecutablesPath(@"../OpenFileConverter.API");
            }
            else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                FFmpeg.SetExecutablesPath(@"../OpenFileConverter.API");
            }
            else
            {
                throw new PlatformNotSupportedException("Unsupported OS platform");
            }
        }

        public async Task<string> ConvertMp3ToMp4(string inputFilePath, string outputFilePath)
        {
            var conversion = await FFmpeg.Conversions.FromSnippet.ToMp4(inputFilePath, outputFilePath);
            await conversion.Start();
            return outputFilePath;
        }

        public async Task<string> ConvertMp4ToMp3(string inputFilePath, string outputFilePath)
        {
            var conversion = await FFmpeg.Conversions.FromSnippet.ExtractAudio(inputFilePath, outputFilePath);
            await conversion.Start();
            return outputFilePath;
        }
    }
}